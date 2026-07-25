# Email Cron Job — Root Cause Analysis Report

**Date:** July 24, 2026
**Issue:** Email cron job breaks inconsistently — sometimes works, sometimes doesn't

---

## Architecture Overview

The system uses two cron triggers to call the same Vercel API endpoint:

- **Vercel Cron** (`vercel.json`): Schedule `0 21 * * *` (21:00 UTC / 2:30 AM IST)
- **GitHub Actions** (`.github/workflows/daily-email-cron.yml`): Schedule `30 15 * * *` (15:30 UTC / 9:00 PM IST)

The cron route (`/api/cron/send-emails`) fetches users from Supabase, fetches upcoming contests by self-calling `/api/contests`, and sends digest emails via Gmail SMTP (nodemailer).

---

## Issues Found

### 1. CRITICAL BUG: Field Name Mismatch (`start_time` vs `startTime`)

**File:** `app/api/cron/send-emails/route.ts:74`

```ts
const startTime = new Date(contest.start_time);  // ← start_time (snake_case)
```

The contests API returns fields as **camelCase** — `startTime`, not `start_time`. This is defined in:

- `app/api/contests/providers/Clist.js:43`
- `app/api/contests/providers/MultiScraper.js:39`

```js
return { startTime: startTime.toISOString(), ... }
```

`contest.start_time` is always `undefined` → `new Date(undefined)` → `Invalid Date` → filter **always returns empty array** → emails are **always skipped**.

**Impact:** The cron route as currently coded **can never send digest emails**.

---

### 2. Duplicate Cron Triggers at Different Times

| Trigger | Schedule | UTC Time | IST Time |
|---|---|---|---|
| Vercel Cron (`vercel.json`) | `0 21 * * *` | 21:00 UTC | **2:30 AM IST** |
| GitHub Actions | `30 15 * * *` | 15:30 UTC | **9:00 PM IST** |

- The GitHub Actions one runs at the intended time (9 PM IST).
- The Vercel one runs at 2:30 AM IST (probably unintended).
- On **Vercel Hobby plan**, cron jobs are limited to **once per day**. Having two paths in `vercel.json` may cause unpredictable behavior.

---

### 3. GitHub Actions Scheduled Workflows Get Auto-Disabled

GitHub automatically **disables scheduled workflows** after **60 days of repository inactivity** (no pushes).

From GitHub docs:
> *"Scheduled workflows are disabled by default when a repository has had no activity for 60 days."*

This directly explains the "sometimes works, sometimes not" — it works right after you push code, then silently stops.

---

### 4. `NEXT_PUBLIC_APP_URL` Likely `localhost` on Vercel

In `.env:3`:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000/
```

`NEXT_PUBLIC_*` vars are inlined at build time by Next.js. If this isn't overridden in Vercel's dashboard env vars, the cron route at line 56 does:

```ts
const contestsResponse = await fetch(`${appUrl}/api/contests`);
// → fetch("http://localhost:3000/api/contests")  ← FAILS on Vercel
```

This would cause the entire cron to throw `"Failed to fetch contests"`.

---

### 5. Vercel Cron Auth Header Issue

The cron route checks (`route.ts:22`):
```ts
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`)
```

Vercel Cron **does** send `Authorization: Bearer <crontab-secret>`, but this secret is set via Vercel dashboard, **not** from your `.env` file. If `CRON_SECRET` isn't set as a Vercel env var, `process.env.CRON_SECRET` is `undefined`, and the comparison fails → **401 Unauthorized**.

---

### 6. Self-Referencing Fetch = Timeout Risk

The cron route fetches contests by calling **its own API endpoint** (`/api/contests`). On Vercel serverless:

- This spawns a **separate serverless function** for the contests API
- The contests API calls 9+ external APIs (Clist, LeetCode, Codeforces, CodeChef, etc.)
- On **Vercel Hobby**, functions timeout at **10 seconds**
- The email-sending loop has 3 retries × 10s timeouts per user
- **In-memory cache** (`cache.ts`) isn't shared between serverless instances, so every cron invocation forces a cold fetch of all external APIs

---

### 7. Gmail SMTP Spam Blocking

SMTP config:
```
SMTP_USER=foodhubservice123@gmail.com
SMTP_PASSWORD=bdbzrrdbmbibuger  (Gmail App Password)
```

Problems:
- **No SPF/DKIM/DMARC** records (you can't set these for `gmail.com` domain)
- Gmail free accounts have a **~500 emails/day** limit
- Google's spam filter flags bulk-sent emails from personal Gmail accounts
- Confirmed: *"google blocks as spam personal email"*

---

## Summary Table

| # | Issue | Severity | Type |
|---|---|---|---|
| 1 | `start_time` vs `startTime` field mismatch | **Critical** | Code bug |
| 2 | Duplicate cron (Vercel + GitHub Actions) | High | Config |
| 3 | GitHub Actions auto-disables after 60 days idle | **High** | Platform |
| 4 | `NEXT_PUBLIC_APP_URL` = `localhost` on Vercel | **High** | Config |
| 5 | Vercel `CRON_SECRET` env var might be missing | High | Config |
| 6 | Self-fetch timeout + no cache sharing | Medium | Architecture |
| 7 | Gmail spam blocking (no DNS verification) | Medium | Email delivery |

---

## Conclusion

The most likely reason it "sometimes works": It works when you manually trigger via GitHub Actions `workflow_dispatch` (after recently pushing code so the workflow isn't disabled), and the test-email endpoint which uses a 7-day window and different code path. The automated daily cron is almost certainly broken most of the time due to issues #1, #3, and #4 combined.
