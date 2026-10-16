# Algorithms & Core Domain Logic

This directory isolates **pure computational logic** from framework adapters, database queries, and network I/O.

### Architectural Principles (LLD & Clean Code)
1. **Single Responsibility Principle (SRP)**: Each file has exactly one reason to change.
   - `cycleAnchor.ts`: Temporal windowing and deterministic idempotency identifiers.
   - `staggerDelay.ts`: Queue dispatch rate calculations and thundering-herd prevention.
   - `topContent.ts`: Resource ranking and engagement weight calculations.
2. **Deterministic & Pure**: Given identical inputs, every function returns identical outputs with **zero side-effects**.
3. **Framework Agnostic**: No dependencies on Next.js, Mongoose, Supabase, or external SDKs. 100% unit-testable in any runtime.

---

## 1. Cycle Anchor & Idempotency (`cycleAnchor.ts`)

### Problem Statement
Weekly review pipelines run on Sunday (e.g. 15:30 UTC). In distributed production systems:
- A worker task may fail and retry on Monday at 02:00 UTC.
- An administrator might manually trigger a sync on Tuesday.
- A network blip might cause Vercel or QStash to fire the trigger route twice.

If the system identifies cycles using naive timestamps (`new Date().toISOString()`), the Monday retry treats the job as a *new* cycle:
- It re-invokes paid LLM APIs (Gemini).
- It charges extra tokens.
- It emails the user a second time for the same week.

### Temporal Rewind Algorithm
To prevent this, `calculateCycleKey` deterministically anchors any timestamp to its active Sunday cycle in UTC:

1. Read day of week in UTC: `utcDay = date.getUTCDay()`.
   - `0` = Sunday
   - `1` = Monday
   - `...`
   - `6` = Saturday
2. Rewind formula:
   $$\text{daysToSubtract} = \begin{cases} 0 & \text{if } \text{utcDay} = 0 \\ \text{utcDay} & \text{if } \text{utcDay} > 0 \end{cases}$$
3. Produce the canonical key in `YYYYMMDD` format (e.g., `"20261018"`).

### QStash Deduplication Key
`buildDeduplicationId(userId, cycleKey)` generates:
$$\text{dedupId} = \text{"review-" } + \text{cycleKey} + \text{"-" } + \text{userId}$$

- **QStash SLA**: Stores deduplication IDs for 90 days.
- **Result**: Duplicate trigger events within the same weekly cycle are immediately dropped at the queue ingress before reaching any worker.

---

## 2. Queue Dispatch Staggering (`staggerDelay.ts`)

### Problem Statement (The Thundering Herd)
At 1,000 active users, triggering all jobs concurrently at 15:30:00 UTC instantly crashes downstream APIs:

| Downstream Service | Hard Rate Limit | Failure Mode at 1,000 Concurrent Calls |
| :--- | :--- | :--- |
| **Codeforces API** | 5 requests / sec | HTTP 429 Too Many Requests |
| **Resend Email API** | 2 requests / sec | HTTP 429 Rate Limit Exceeded |
| **Gemini AI API** | ~15 RPM (free) / ~360 RPM (paid) | Quota Exceeded / 503 Overloaded |
| **MongoDB Atlas** | Connection pool limits | Serverless connection spike timeouts |

### Mathematical Delay Model
Rather than a thundering herd, we apply **linear rate staggering** across the queue fan-out:

$$\text{delaySeconds}(i) = \left\lfloor \frac{i}{r} \right\rfloor$$

Where:
- $i$ = 0-indexed position of the user in the batch ($0 \le i < N$)
- $r$ = target dispatch rate (default: $1.5 \text{ jobs/sec}$)

### Latency Progression at 1.5 jobs/sec

| User Index ($i$) | Scheduled Delay ($\Delta t$) | Real-world Time Elapsed |
| :---: | :---: | :---: |
| **0** | `0s` | Immediate (15:30:00 UTC) |
| **15** | `10s` | +10 seconds |
| **90** | `60s` | +1.0 minute |
| **500** | `333s` | +5.5 minutes |
| **1,000** | `666s` | +11.1 minutes |

**Outcome**: All 1,000 reviews complete reliably in ~11 minutes while maintaining a flat $\approx 1.5 \text{ req/sec}$ load on Codeforces, Gemini, and Resend.

---

## 3. Top Content Ranking (`topContent.ts`)

Calculates engagement ranking scores for community feed resources:

$$\text{Score} = (\text{realViews} \times 16) + (\text{views} \times 1) + (\text{upvotes} \times 2) + (\text{comments} \times 1)$$

- Uses relative integer weights to avoid floating-point drift.
- Prioritizes active click-through engagement ($80\%$) over passive feed views ($5\%$).
