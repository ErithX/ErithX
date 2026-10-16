# ErithX Interview Questions â€“ Focused on LLM Weekly Review (Real, Human Explanations)

*Meant to grill. Answers are written the way you'd actually explain this to another dev in an interview â€“ no dumping of jargon for the sake of it.*

## 1. LLM Weekly Review Process (Main Focus)

### Q1. Walk me through the "Sunday Weekly Review" end-to-end. As if you were explaining it to someone seeing it for the first time.

**A:** 
Every Sunday, Vercel cron hits `GET /api/qstash/trigger-weekly-reviews` with `CRON_SECRET`. That endpoint pulls all `user_profiles` from Supabase who have `mentor_review_enabled !== false` and fan-outs: for each user it publishes one QStash job to `POST /api/qstash/process-user-review`.

The worker (`process-user-review`, `maxDuration=60`) does the real work:
1. Pull fresh platform stats (LeetCode GraphQL, Codeforces API, GitHub, CodeChef) via `platform-fetchers.ts` and write them to `PlatformStats` (Mongo).
2. Build a tight context using `generateAIContext()` in `services/core/dataFilter.ts`. It filters history + current stats down to what actually matters for the user.
3. Call the LLM router (`reviewerRouter.ts`) which runs **two sequential** LLM calls (Reviewer -> Planner).
4. Save the result via `reviewStorage.ts` (sanitize banned words, clamp `roy_factor` to 0â€“5) into `AIReview`.
5. Try to send the email via Resend.

The key thing: **fan-out per user**. Instead of generating reviews in one big loop, each user becomes its own QStash job. That means one slow/failing user doesn't necessarily block others, but it also means "one user = one job" creates its own blast radius if triggered wrongly.

---
## 1. LLM Weekly Review Process (Main Focus) - continued

### Q2. Why run two LLM calls (Reviewer first, then Planner) instead of just one big prompt?

**A:**
Because the two jobs are fighting each other if you shove them together.

- **Reviewer call** (`getReviewerPrompt`) is meant to act like a brutally honest, senior mentor. It writes the actual review text, produces a `hidden_summary` (internal), and decides an absolute `roy_factor` (0–5).
- **Planner call** (`getPlannerPrompt`) takes that review text + career target and outputs `targets_set` + `monthly_roadmap`. Its only job is to turn advice into actionable next steps without re-writing the tone.

By doing them **serially**, the Planner reads the *exact* tone/stance the Reviewer just took. If you merged both into one prompt, you'd see the model flip-flop: either it becomes too soft trying to "plan", or it loses the "grilling" tone while trying to be structured.

Also, the router explicitly treats Planner failure as non-fatal – it falls back to a default `targets_set` so the user still gets a review. That wouldn't be as clean with a single monolithic call.

---

### Q3. Look at the fallback chain: Gemini -> Groq (Llama). In plain words, what’s the thinking here? What are the tradeoffs?

**A:**
The router tries **Gemini** first (`callGemini.ts`). If that fails (network/429/retry-exhausted), it falls back to **Groq** calling `openai/gpt-oss-120b` (`callLlama.ts`).

The tradeoff is pragmatic: primary model is the one tuned to match the desired mentor tone. Fallback is there purely for **availability**. But there are real side effects:

- **Different "personalities"** – Gemini and Groq can interpret the same strict persona differently. Users might get a slightly harsher/softer review on a rare fallback run.
- **Payload trimming** – `callLlama.ts` explicitly strips `roy_factor`, `career_target`, `review_focus_this_week` from the payload before calling Groq. That's intentional to avoid confusing the fallback model, but it also means the "contract" isn't identical between providers.
- **Silent degradation** – fallback "works" but the review might not be *exactly* what you'd expect from the primary path.
- **Cost/observability** – without clear logging of "which provider actually produced this review", debugging "why this week's review felt off" becomes guesswork.

So it's a good resilience move, but it also quietly changes the system's behavior under failure.

---

### Q4. What is `roy_factor`? Why does the code clamp it to [0,5]? Why treat it as "absolute" from the Reviewer?

**A:**
`roy_factor` is the Reviewer's gut-check: "How on-track is this user *right now* based on the weekly evidence?". The Reviewer is explicitly told to decide it (0–5) from the payload.

Reasons for clamping in `reviewStorage.ts`:
- **Guardrail against model drift** – LLMs occasionally return "6", "-1", or stray text. Clamping forces it back into a valid band.
- **Prevents UI breakage** – the dashboard maps `roy_factor` to "On track / Mild drift / Targets missed". If it's out of range, those labels become meaningless.
- **Keeps it comparable** – if every run can emit arbitrary numbers, you can't meaningfully look at trends across weeks.

Treating it as "absolute" from the Reviewer (not recomputed later) is deliberate. The Reviewer sees the filtered context + history. If the Planner tried to override it, you'd blur "what changed this week" vs "what's the long-term stance". The `roy_factor` is meant to reflect this week's honest read.

---

### Q5. What's `hidden_summary`? Why keep it separate from `review_text`?

**A:**
`hidden_summary` is internal-only. The actual email/user UI shows `review_text`, `targets_set`, `monthly_roadmap`. `hidden_summary` is meant for internal reasoning/ops (e.g. superadmin context when manually tweaking or debugging a review).

Keeping it separate avoids leaking terse/internal notes to the end user. Also the prompt explicitly treats it as internal. The "separation of concerns" is simple: **what we say to the user vs what we keep for ourselves to understand why we said it**.

---

### Q6. The worker never sets `email_sent`. The cron `send-review-emails` looks for `email_sent:false`. Explain the real impact.

**A:**
In `app/api/qstash/process-user-review/route.ts`, after calling `sendWeeklyReviewEmail()` the code does **not** set `email_sent = true` on the saved `AIReview`. But `GET /api/cron/send-review-emails` scans for reviews with `email_sent:false` and sends them (marking sent afterwards).

So right now:
- Either the review sits there "unsent" and the dedicated cron will pick it up later and actually mark it sent.
- Or reviews can be picked up **again** by that cron if something went wrong between save and marking.
- Or worse, with the current state, the "worker already emailed" vs "cron must email" boundary is fuzzy.

The **documented bug (B4)** is: "Worker never sets `email_sent`". The real human impact: **duplicate emails**. If the worker "thinks" it tried, but never flipped the flag, or if multiple paths (worker + cron + admin manual send) all operate on `email_sent`, you can easily fire the same review email twice. Also it makes "did we actually email this user?" unanswerable just by looking at the review document.

Fixing it means: decide **one** owner of "set email_sent=true". If the worker successfully sends, set it. If you truly want a "retry queue", have the cron own it. But don't leave it unset after a successful send.

---

### Q7. Fan-out via QStash: one job per opted-in user. What's clever about this? What's dangerous about it?

**A:**
**Clever:**
- Natural backpressure & retries per user (`retries: 3`).
- Failures isolate – one user's flaky GitHub/CF fetch won't kill the whole batch.
- Easy to inspect/replay a single user's job in QStash if something looks off.
- Scales reasonably if the list grows.

**Dangerous (very real here):**
- **No idempotency key** on publishing the fan-out jobs (`trigger-weekly-reviews`). If the cron is hit twice (misconfigured Vercel cron, or someone hits the endpoint with the right `CRON_SECRET`), you'll enqueue the **same user twice** for the same Sunday window.
- **Auth commented out** on `trigger-weekly-reviews` (audit) – if `CRON_SECRET` leaks or the route becomes reachable, you can trigger a mass run and burn LLM credits.
- **Dev bypass** of QStash signature verification on `process-user-review` when `NODE_ENV==='development'` – convenient, but easy to get sloppy.
- **No "week_start_date" guard** – the system doesn't enforce "only generate once per (user_id, week_start)". Without a unique key like `{ user_id, week_start_date }` + `$setOnInsert`, you can create **duplicate `AIReview` documents**.

This is exactly the "weekly-review-created-twice" class of bug called out in the inbox.

### Q8. "Schema drift" between platform fetchers and `dataFilter/generateAIContext`. Give me a real example from this codebase.

**A:**
The fetchers write to `PlatformStats` based on what each platform actually returns. `generateAIContext()` reads that same shape and passes a filtered payload to the LLM. The mismatch is: **writer and reader never truly share the same "contract"**.

Concrete ones from BE-08:
- **Codeforces**: fetcher logic expects/sets fields that don't align with how `overview/history` are consumed? Result: CF rating ends up treated as 0 in practice.
- **GitHub**: fetcher may look at `totalContributions` vs schema field `totalContributionsLastYear`. Also `handle` vs `username`, `recentEvents` often never populated. That makes GitHub look "empty" to the review engine even if user is active.
- **LeetCode**: `history[].hard` isn't present in the schema the context reads from -> `hard_per_week` becomes `[0,0,0]`.

**Human view:** It's like two people writing to the same fridge but using different labels. One writes "milk", other looks for "dairy". Nothing crashes, but the answer is silently wrong. The review will say "not enough LeetCode hard" purely because of a shape mismatch, not because the user actually slacked.

---

### Q9. The prompts have "banned words" + `sanitizeBannedWords()`. Why sanitize *after* generation?

**A:**
Because you don't want to blindly cripple the model. The prompt (`prompts.ts`) instructs the Reviewer to avoid certain harsh/overblown phrases. `sanitizeBannedWords()` in `services/ai/sanitize.ts` is a **post-filter safety net**.

Reasons:
- **Defense-in-depth** – models don't always follow "don't say X" 100% of the time, especially on fallback.
- **Cheap & deterministic** – string replace on the saved `review_text` is trivial and reversible in logic.
- **Keeps persona controlled** – prevents slipping into clickbaity/over-dramatic lines while still letting the model reason freely.
- **Prevents accidental leakage** – catches any edge cases from the fallback provider.

The banned list is small and paired with replacements. Doing it **after** means you preserve the model's natural flow in the prompt, but you still sanitize the persisted text before showing/saving.

---

### Q10. "Career target routing", "weekly-focus rotation", "strictness". How do these actually affect the review?

**A:**
`dataFilter.ts` builds `UserFilterConfig` from user state (`mentorPrefs`, history, `roy_factor`, `career_target`, `user_focus`, etc.). That config flows into `generateAIContext()` and then into prompts.

- **Career target routing** (`FAANG / Top Product / Startup / Balanced / Custom`) – steers what "good" looks like. For FAANG-style, the bar for consistency looks different than "balanced".
- **Weekly-focus rotation** – nudges the review to pick **one** practical theme this week instead of dumping 12 things. Keeps it actionable.
- **Strictness** – is derived/used to modulate tone without going fully soft. The idea: a user who's been repeatedly slipping shouldn't get the same polite phrasing as someone who's just had one off-week.

In practice, these exist so the "same engine" doesn't spit identical reviews to very different users. The goal is **personalized without over-engineering**. But since a lot of it flows via the filtered JSON to the LLM, if `dataFilter` drops the wrong field (schema drift), the routing simply stops working.

---

## 2. Article Publish Flow (Creator Studio)

### Q11. Walk me through how an article goes from "draft" to "published". Be honest about the flow.

**A:**
User writes in `app/dashboard/write/page.tsx`. Client-side validation enforces: title>=3, content>=20. For 'Career' cover is mandatory. For 'Project Blueprints' subtitle is mandatory. On submit it hits `PUT/POST` via `documents` routes with `status: 'pending'`.

The author sees `app/dashboard/write/pending/page.tsx` confirming it's under review.

**Superadmin approval** lives in `app/dashboard/admin/review/page.tsx`. Superadmin reads `GET /api/admin/pending` (pending resources) and uses `PUT /api/admin/pending/[id]` to approve. Approving sets `status: 'published'`, refreshes `createdAt` (so it appears "fresh" in feed), and creates a `Notification` for the author.

**Public side:** `GET /api/resources` returns only `published` (cached 300s). `GET /api/resources/[id]` resolves by ObjectId or slug. Upvotes/views are separate endpoints.

Model: `models/Resource.ts` has statuses `['draft','pending','published','rejected']` + `rejectionReason`, `slug`, `category`.

**Reality:** "Publish" is really **"superadmin promotes pending->published"**. There's no self-publish path. The UI makes it feel like submission, approval is manual.

---

### Q12. Why does approving set `createdAt` again?

**A:**
Look at `admin/pending/[id]` behavior: on publish it updates fields and **refreshes `createdAt`**. The feed likely sorts by `createdAt` desc and shows relative time ("2 hours ago").

If you don't bump `createdAt`, an article that sat in "pending" for 3 weeks would suddenly jump to the very top but look "old". By setting `createdAt = new Date()` on approval, it behaves like a **new publish** in the listing. It's a UX choice, not a data-integrity one.

The tradeoff: you lose the **true "first drafted"** timestamp. If later you ever need "time-to-publish" (draft->approved), you'd want a separate `approvedAt`/`publishedAt`. Right now you can't answer "how long did this sit in review?" reliably from `createdAt` alone.

---

### Q13. What could go wrong in this approval flow from a product/security lens?

**A:**
- **Only status checked** – approval is "promote pending->published". Need to ensure id is actually `pending`. Also `rejected` items shouldn't be re-published accidentally.
- **Notification on publish only** – author gets notified on approval. Rejection path: is `rejectionReason` stored and notified? Worth checking.
- **Feed cache** – `GET /api/resources` has `revalidate=300`. After approving, the public list might lag up to 5 min unless revalidated.
- **Slug collisions** – if slug isn't enforced unique, linking by slug could be ambiguous.
- **Author trust** – anyone who can submit "pending" can create content. Approval is the gate.

Also note: `PUT /api/documents/[id]` checks superadmin via `NEXT_PUBLIC_SUPERADMIN_EMAILS`. Using a **NEXT_PUBLIC_*** env var for an auth/permission check is a red flag (see security below). But for the "creator studio" flow, the key gate is the **admin pending API**.

---

## 3. Superadmin Features

### Q14. How is "superadmin" actually determined in this app?

**A:**
`app/lib/superadmin.ts`:
- `isSuperadminEmail(email)` checks against `SUPERADMIN_EMAILS` or `NEXT_PUBLIC_SUPERADMIN_EMAILS` (comma-separated).
- `requireSuperadmin()` reads the session/user email and throws 403 if not match.

So it's **email-based allowlist**, not a role column in DB. That’s simple and fast.

But the audit flags `NEXT_PUBLIC_SUPERADMIN_EMAILS` being read in **client components** (`Navbar.tsx:144`, `write/page.tsx:330`). Putting an allowlist in a public bundle means the list of admin emails is **visible to anyone inspecting JS**. It's not "who can become admin", but it does reveal "who *is* treated as admin by UI". Not ideal.

Also "professional/student/creator" role comes from `user_metadata.role` on OAuth (`auth/callback/route.ts`) and is client-controllable via `?role=` query param there. **Superadmin is separate** from that role.

---

### Q15. Superadmin has "Review Studio", "Content Approvals", "Live Telemetry", "User Directory". Which of these actually touches the LLM review system?

**A:**
Directly tied to LLM weekly review:
- **Review Studio** (`app/dashboard/admin/reviews/page.tsx`, APIs `admin/reviews/*`) – can list users+reviews, generate a review on-demand (`POST /api/admin/reviews/generate` with `{userId, adminNote, sendEmail}`), edit review text/targets and resend (`POST /api/admin/reviews/send`).
- `generate` path **stamps `email_sent`** when emailing (unlike the normal worker). Also can inject `adminNote` into context via `dataFilter`? Need to see, but the endpoint exists to force-generate.

So superadmin can **manually trigger** the same pipeline for a single user. That's useful for debugging "why didn't Sunday run for X?" or to test prompt changes. The danger: hitting generate repeatedly with `sendEmail:true` can spam the user unless `email_sent` logic is tight.

Also "prune orphaned Mongo profiles" exists in `admin/reviews` routes – cleanup after dual-DB drift.

---

### Q16. If you were asked to "tighten" superadmin access without overhauling auth, what’s the minimal realistic fix?

**A:**
Keep email-allowlist but **stop leaking it**:
- Never read `NEXT_PUBLIC_SUPERADMIN_EMAILS` on client. Compute "isSuperadmin" by calling a tiny server endpoint (`GET /api/user/me` or `/api/superadmin/check`) or derive from server-side session.
- Move the full list to server-only `SUPERADMIN_EMAILS`.
- Add a **server-side guard** to *every* admin route (use `requireSuperadmin()` consistently). Don't rely on "hidden" UI.
- Consider adding a **simple audit log** (`SystemLog` model exists) for superadmin actions (generate review, publish article, reactivate user).
- Don't trust `?role=` from URL in OAuth callback – ignore or validate against allowlist.

Also the `middleware.ts` gates `/dashboard` but doesn't enforce "superadmin-only" subroutes – each page/API must enforce.

## 4. Contest Page

### Q17. How does `/contests` actually get contest data? Explain the primary+fallback idea.

**A:**
`app/api/contests/route.js` uses in-memory cache (10 min) + two sources:
- **Primary:** `providers/Clist.js` hits `clist.by` API using `CLIST_USERNAME`/`CLIST_API_KEY` (10s abort).
- **Fallback:** `providers/MultiScraper.js` scrapes multiple platforms in parallel via `Promise.allSettled`: CodeChef, Codeforces, GeeksforGeeks, LeetCode, HackerEarth, AtCoder, HackerRank, SPOJ.

The route tries CLIST first. If CLIST returns usable data -> use it. Else fall back to MultiScraper. Then `applyContestRules()` normalizes.

**Why this split?**
- CLIST is a single aggregator (cleaner, less brittle per platform). Good for coverage + less scraping flakiness.
- MultiScraper is a "resilient" fallback when CLIST is down/rate-limited.

**Tradeoffs:**
- Two different data shapes -> normalization is non-trivial.
- MultiScraper does many parallel fetches -> can be slow/heavy.
- **Hard-coded CLIST API key fallback** in `MultiScraper.js:271-272` (flagged HIGH in audit) – bad practice.
- In-memory cache means "restart clears it", and multiple Vercel instances each have their own cache.

---

### Q18. The contest "algorithm" has platform weights, junk filters, MAX_MAIN_DURATION_SECONDS (3 days). What's the point?

**A:**
`algorithm.js` tries to make the contest board **actually useful for "contest/placement prep"** instead of dumping every contest on earth.

- **Platform weights** (`PLATFORM_WEIGHTS`) – e.g. LeetCode weighted higher than ctftime. Reflects "relevance to DSA/CP audience" for this product.
- **Categories** – bucket into `dsa-cp`, `ai-ml`, `cybersecurity`, `other`.
- **Junk/university filters** – drop very niche/local university contests that add noise.
- **`MAX_MAIN_DURATION_SECONDS = 3*24*3600`** – contests longer than ~3 days go to "Long-Term" tab. The "main" feed stays focused on short/upcoming contests you'd realistically attempt.

The scoring spec (`Docs/contest-rule.md`: PS = Platform + Difficulty + Time Proximity + Social Proof) is about **ranking**, not just listing. The idea: surface contests worth clicking, not just "what exists".

**Human take:** Without filtering, CLIST gives you a firehose. The algorithm is product taste. The risk: over-filtering and hiding genuinely useful contests.

---

### Q19. MultiScraper uses `Promise.allSettled`. Smart or just lazy? Explain.

**A:**
It's the right call here. If you did `Promise.all` and **any** single platform fetch throws, you'd lose **all** fallback results. With `Promise.allSettled`, Codeforces can fail, but CodeChef/GFG/LeetCode might still return fine.

Also different platforms have different reliability. Some HTML pages change often, some rate-limit.

**But "smart" vs "lazy":**
- **Smart** for resilience – partial success is better than total failure.
- **Can be misleading** – you don't know *why* each failed unless you log. Also timing out slowly hurts UX.
- **Harder to reason about** – you must explicitly check `status==='fulfilled'` and normalize each provider's shape.

Overall, for an aggregation fallback, `allSettled` is the correct pragmatic choice.

---

## 5. Connecting the Dots: Real Tradeoffs

### Q20. Dual DB (Supabase + Mongo). Why keep both? What's the cost?

**A:**
ADR-001 states the split:
- **Supabase**: Auth + `user_profiles` (UI-facing, email prefs, account state). Easy auth, RLS-ready, less migration friction for UI fields.
- **MongoDB**: domain-heavy, flexible docs – `User`, `AIReview`, `PlatformStats`, `Resource`, `Notification`, `UserActivity`. The LLM pipeline reads/writes nested, evolving shapes (history arrays, weekly deltas) that change often.

**Why merged in `/api/user/profile`:** instead of adding more columns to Supabase, they merge Supabase profile + Mongo `mentorPrefs` in one response. Avoids a schema migration just to add mentor prefs.

**Costs:**
- **Two sources of truth** – "does this user exist?" can mean "in Supabase auth" or "has Mongo User doc". Orphaned docs happen (hence "prune orphaned Mongo profiles").
- **Join in app code** – `supabaseId` link. No real DB-level FK.
- **Sync bugs** – e.g. soft-delete/reactivate touches both paths (`user/delete`, `user/reactivate`).
- **Harder to reason about consistency** – write to Supabase, write to Mongo – one can succeed, other fail.

The tradeoff is **velocity vs consistency**. For this product (fast-moving AI + content), the flexibility of Mongo for the "review engine" is probably worth the extra care.

### Q21. You see "auth guards commented out" on 3 cron/QStash endpoints. Explain in plain words why that's scary here.

**A:**
Endpoints:
- `cron/send-review-emails`
- `cron/inactivity-check`  
- `qstash/trigger-weekly-reviews`

Right now they **expect** `Authorization: Bearer ${CRON_SECRET}` but the audit says the guard is commented. If truly open:
- **Mass LLM spend** – hitting `trigger-weekly-reviews` enqueues every opted-in user -> QStash fan-out -> each hits LLM twice. Can rack up serious cost very fast.
- **Spam** – `send-review-emails` can resend emails to many users.
- **Account impact** – `inactivity-check` does Day-12 warnings + Day-14 deletion/suspension logic. Publicly triggerable = dangerous.
- **Abuse** – anyone who discovers the route can hit it repeatedly.

Also `dev bypass` on QStash signature verification makes local dev easy but tempts leaving weaker checks in prod.

**Fix mindset:** treat these as **internal-only**. Either enforce the bearer check, or lock to Vercel Cron + QStash verified signatures only. Don't leave them effectively public.

---

### Q22. `/api/profile` has no auth (IDOR). Also `?role=professional` is client-controlled. Connect these to the "real" risk.

**A:**
**IDOR on `/api/profile`:** if you can call `GET /api/profile?supabaseId=...` without auth, you can read another user's profile. If `POST` allows upserting arbitrary fields (incl. `isPro: true`), you can **self-escalate** or tamper with data.

**`?role=professional` in OAuth callback:** the callback takes `role` from query and writes to `user_metadata.role`. Client can pass whatever they want. Then `/dashboard/pro` exists but middleware only redirects "professional" to `/dashboard/pro` – doesn't **enforce** "you must be professional to see pro-only UI/data". Also navbar shows/hides based on client state.

**Real risk:** privilege confusion + horizontal access. Even if "superadmin" is separate, mixing "role" from URL with session is sloppy. Attackers can probe endpoints and, combined with public bundles, learn structure.

---

### Q23. Looking at this whole LLM review system, what’s the single weakest spot you'd fix first and why?

**A:**
**Idempotency + trigger safety.**

Specifically:
1. **Add idempotency to fan-out** – when triggering weekly reviews, compute `week_start_date` (e.g. Monday/Sunday boundary) and **do not** republish jobs for `(user_id, week_start_date)`. Also add a "lock" key or check "did we already create an `AIReview` for this user this week?" before enqueueing.
2. **Reinstate auth on cron/QStash trigger endpoints** – no "commented out" guard. Rely on `CRON_SECRET` + QStash `verifySignatureAppRouter` where applicable.
3. **Fix `email_sent` ownership** – pick one path. If worker sends successfully, set `email_sent=true`. If cron owns retries, worker must **not** also "assume" sent.

**Why first:** These directly cause **duplicate reviews, duplicate emails, and runaway cost**. Schema drift is annoying (silent wrong reviews). But idempotency+auth are the ones that can **multiply damage** fast with one accidental curl.

Also "no idempotency anywhere" is called out explicitly in BE-08. That matches real incidents like "created twice".

---

## 6. Quick "Grill" Mix (Cross-cutting)

### Q24. Why does the UI show `roy_factor` as labels ("On track/Mild drift/Targets missed") instead of just showing the number?

**A:**
Numbers are cold. "On track" is human. The mapping reduces anxiety and avoids users fixating on "I got 2.7". It also forces a consistent interpretation across the app.

But it also **hides nuance**. Two users with same label can have very different reviews. Also if `roy_factor` ever gets clamped weirdly, the label is what users see, not the raw number.

---

### Q25. The Review Studio can "edit `generated_text`/`targets_set` then email". Is that a good idea?

**A:**
Yes, with discipline. Sometimes the LLM nails tone but botches one target. Editing before sending saves the user from a confusing review.

But risks:
- **Drift from AI trail** – if you edit `generated_text` but don't also reconcile `hidden_summary`/`roy_factor`, the "internal" state no longer matches what was sent.
- **No audit trail** – who edited what, when? `SystemLog` exists but is it used here?
- **Human bias** – easy to soften after the fact and defeat the "brutally honest" intent.
- **Testing temptation** – editing becomes a crutch instead of fixing prompt/data.

So "yes" for ops, "dangerous" without logging.

---

### Q26. In one line: what's the biggest lesson from this codebase about "LLM + scheduled jobs"?

**A:**
**Treat LLM calls as expensive, non-deterministic side effects.** Fan-out is correct. Fallback is correct. But without **idempotency, strict contracts between fetcher->context->prompt, and "sent" state**, a single Sunday cron can quietly create duplicates, spam users, or burn money. Resilience is more about "don't run twice" than "retry 10 times".

---

### Q27. If you had to explain this LLM weekly review to a non-technical PM in 2 minutes, what would you actually say?

**A:**
"Every Sunday we build a tiny snapshot of each user's coding activity from LeetCode/Codeforces/GitHub/CodeChef. We feed only that snapshot + last few reviews to an AI mentor. It writes an honest review in Hinglish+English, suggests 2–3 targets, and a rough monthly roadmap. Then we email it. The goal isn't to flatter – it's to say 'here's what's actually working, here's what's slipping'. We keep it short and actionable so they actually do it next week."

That's it. No mention of QStash, routers, or providers. Just the product truth.

---

**Bottom line for interviews:** Don't just say "it calls Gemini". Say *why* two calls. Say *where* the state machine is weak (`email_sent`, idempotency). Say *how* dual-DB creates quiet bugs. And most importantly – point out the **silent failures** (schema drift, fallback changing tone, clamping hiding raw model output). Those are the things that actually bite in prod.
