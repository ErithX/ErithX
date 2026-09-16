# Product Architecture — ErithX Weekly AI Review System

> High-level, visual guide to how the Weekly Review system is wired together:
> the Reviewer↔Planner LLM flow, prompt divisions, provider fallback, data assembly,
> storage, and scheduling. Intentionally high-level — trace the boxes, not the code.

---

## 1. End-to-End Flow (Trigger → Email)

```mermaid
flowchart LR
    V["Vercel Cron<br/>Sun 15:30 UTC"]
    Q["QStash Trigger<br/>/api/qstash/trigger-weekly-reviews"]
    W["Worker per user<br/>/api/qstash/process-user-review"]
    A["Superadmin Manual<br/>/api/admin/reviews/generate"]
    D["Data Assembly<br/>generateAIContext()"]
    LLM["LLM Router<br/>generateWeeklyReview()"]
    S["Save Review<br/>saveAIReview()"]
    EM["Email Service<br/>sendWeeklyReviewEmail()"]
    UI["User Dashboard<br/>/dashboard/reports"]

    V --> Q
    Q -->|publish 1 job / user| W
    A --> D
    W -->|fetch fresh platform stats| D
    D --> LLM
    LLM --> S
    S -->|optional| EM
    S -->|"query review history"| UI
```

---

## 2. The Core: Reviewer + Planner are TWO SEPARATE LLM Calls

Every review = **2 independent LLM calls in series**. They are intentionally **not** one call —
the buddy already tested this: *"Reviewer → Planner split"* gives clean alignment where the Planner's
targets always match the Reviewer's tone.

```mermaid
sequenceDiagram
    participant R as Router<br/>reviewerRouter.ts
    participant Rev as Reviewer LLM (Gemini→Groq)
    participant Pln as Planner LLM (Gemini→Groq)
    participant St as reviewStorage.ts

    R->>Rev: Call 1 · Reviewer<br/>payload + Reviewer prompt
    Rev-->>R: review_text, hidden_summary, roy_factor
    Note over R,Rev: fail? → try Groq (fallback key → primary)
    R->>Pln: Call 2 · Planner<br/>payload + review_text-to-align + Planner prompt
    Pln-->>R: targets_set, monthly_roadmap
    Note over R,Pln: fail? → try Groq, else fallback "focus on weak areas"
    R->>St: save (sanitize banned words)<br/>store LLM-decided roy_factor
```

- **Serial dependency** (Planner needs Reviewer text) is deliberate — it guarantees tone/goal alignment.
- Fallback for planner failure is a harmless default target so a Planner hiccup never kills a review.

---

## 3. Prompt Divisions (all inside `services/ai/prompts.ts`)

### 3a. Reviewer prompt — `getReviewerPrompt(careerTarget, royFactor, weeklyFocus)`

```mermaid
flowchart TD
    A["Persona & Tone Rules<br/>banned words injected from sanitize.ts"]
    B["① Career Target Routing (switch)"]
    C["② Roy Factor Behavior Routing"]
    D["③ Weekly Focus Rotation"]
    E["④ Field Guide<br/>+ Roy Factor scale + fairness rules"]
    F["⑤ Output Format (strict JSON)"]

    A --> B --> C --> D --> E --> F

    B --> B1["FAANG / Top Product<br/>Medium-Hard depth, patterns"]
    B --> B2["Startups & Building<br/>GitHub weight, ship code"]
    B --> B3["Competitive Programming<br/>Contests, rating, speed"]
    B --> B4["Balanced<br/>whole picture, no phrase reuse"]

    C --> C1["roy ≥ 2 → brutal, <200 words"]
    C --> C2["roy == 1 → soft firm warning"]
    C --> C3["roy == 0 → normal encouraging"]

    D --> D1["velocity_trends<br/>multi-week story"]
    D --> D2["platform_behavior<br/>erithx_activity contrast"]
    D --> D3["historical_patterns<br/>repeated ignored targets"]
```

### 3b. Planner prompt — `getPlannerPrompt(careerTarget, isMonthlyRoadmap)`

```mermaid
flowchart LR
    G["Planner persona<br/>alignment rules with review_text"]
    H["Career Target Routing<br/>(same 4-way switch)"]
    I["Monthly Roadmap switch"]
    J["Output: targets_set + monthly_roadmap"]

    G --> H --> I --> J
    I --> I1["isMonthlyRoadmap=true<br/>→ 30-day macro plan"]
    I --> I2["else → null"]
```

---

## 4. Provider Fallback Chain (Gemini first, Groq on failure)

```mermaid
flowchart LR
    R["generateWeeklyReview()"]
    G["Gemini<br/>gemini-3.5-flash"]
    GFAIL{"fails?"}
    L["Groq<br/>openai/gpt-oss-120b"]
    LK1["GROQ_FALLBACK_KEY<br/>(tried 1st — known good)"]
    LK2["GROK_API_KEY<br/>(tried 2nd)"]
    OUT["reviewer + planner results"]

    R --> G --> GFAIL
    GFAIL -- no --> OUT
    GFAIL -- yes --> L
    L --> LK1 --> LK2 --> OUT
```

Notes:
- Two separate fallbacks: one for Reviewer, one for Planner.
- **429 rate-limit retry** on Gemini: back off and retry (free-tier ~5 req/min/model).
- Groq tries `GROQ_FALLBACK_KEY` first (the primary `GROK_API_KEY` is currently dead → avoids 3-5s of latency).

---

## 5. Data Assembly Layer (`services/core/`)

```mermaid
flowchart TD
    P["Platform Fetchers<br/>app/lib/platform-fetchers.ts"]
    DB[("MongoDB<br/>PlatformStats (LC/CF/GH/CC)")]
    RD["Raw docs"]
    TA["trendAnalyzer.ts<br/>computeTrend()"]
    PD["patternDetector.ts<br/>detectPatterns()"]
    ACT["UserActivity<br/>erithx_activity"]
    DF["dataFilter.ts<br/>generateAIContext()"]
    OUT["Filtered JSON payload<br/>for the Reviewer LLM"]

    P --> DB
    DB --> RD
    RD --> TA
    DB --> PD
    ACT --> DF
    RD --> DF
    TA --> DF
    PD --> DF
    DF --> OUT

    subgraph "Deterministic enrichments"
        TA
        PD
        ACT
    end
```

**What `dataFilter.ts` computes (math only, LLM interprets):**
- Per-platform metrics: deltas, ratings, active days, weekly solves (`problems_solved_this_week`, `contests_entered_this_week`).
- `calculations.overall_progress_score` (0-100) — a bare number, never labeled.
- `degrade_report.severity` — talking points, not verdicts.
- `trend_3_weeks` arrays via `trendAnalyzer` (`[8, 14, 5]` style, chronological).
- `historical_patterns` via `patternDetector` (compliance trajectory + all past targets).
- `review_focus_this_week` rotation (velocity_trends → platform_behavior → historical_patterns).
- `is_baseline_review` guard for first-ever reviews.

---

## 6. Roy Factor Lifecycle (LLM-decided, no migration)

```mermaid
flowchart LR
    A["previousReview?.roy_factor<br/>(read from AIReview)"]
    B["generateAIContext<br/>roy_factor + is_baseline_review"]
    C["Reviewer LLM decides<br/>NEW absolute roy_factor (0-5)"]
    D["normalize/clamp [0-5]<br/>in provider"]
    E["saveAIReview stores<br/>roy_factor (existing field)"]
    F["Next week: read again → A"]

    A --> B --> C --> D --> E --> F
```

- **New-user edge case:** `isBaselineReview: true` (or no `previous_recommendation`) ⇒ prompt **forces** `roy_factor: 0`.
  A brand-new user can't "ignore" a target that never existed — no unfair first-review escalation.
- Recovery case: improving users go *down*, never up.
- **No DB migration** — `roy_factor` already exists on `AIReview`. Only additive Mongoose schema fields
  (e.g. `contestId` in Codeforces submissions) are used, which Mongo tolerates automatically.

---

## 7. Storage Layer

```mermaid
flowchart LR
    S["saveAIReview()"]
    SAN["sanitize.ts<br/>strip banned words"]
    DB2[("MongoDB<br/>AIReview")]
    Q1["getLatestUserReview()"]
    Q2["getUserReviewHistory()"]
    Q3["detectPatterns()"]
    Q4["Admin Reviews API<br/>Roy factor badge"]

    S --> SAN --> DB2
    DB2 --> Q1
    DB2 --> Q2
    DB2 --> Q3
    DB2 --> Q4
```

- `generated_text`, `targets_set`, `monthly_roadmap`, `hidden_summary`, `roy_factor`, `stats_snapshot`, `admin_note`, `email_sent`.
- Sanitizer is the **safety net** for banners that slip from providers (Bug 5) — applied right before the document is written.

---

## 8. Key Files at a Glance

| Layer | File |
|---|---|
| Router / orchestration | `services/ai/reviewerRouter.ts` |
| Prompts (reviewer + planner) | `services/ai/prompts.ts` |
| Banned-word guard | `services/ai/sanitize.ts` |
| Providers (Gemini / Groq / NIM) | `services/ai/providers/callGemini.ts`, `callLlama.ts`, `callNemotron.ts` |
| Persistence | `services/ai/reviewStorage.ts`, `models/AIReview.ts` |
| Context assembly | `services/core/dataFilter.ts`, `trendAnalyzer.ts`, `patternDetector.ts` |
| Triggers | `app/api/qstash/trigger-weekly-reviews/route.ts`, `app/api/qstash/process-user-review/route.ts`, `app/api/admin/reviews/generate/route.ts` |
| Platform ingestion | `app/lib/platform-fetchers.ts`, `models/PlatformStats.ts` |