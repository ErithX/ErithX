# Email System Fix — Proposed Solution

**Date:** July 25, 2026
**Status:** Proposal (no code changes yet)

---

## Root Cause Analysis: Why Emails Are Not Sending

After thorough codebase investigation, here are the **confirmed bugs** causing all three email types (welcome, contest alert, daily digest) to fail:

---

### BUG #1 (CRITICAL): Field Name Mismatch — `start_time` vs `startTime`

This is the **#1 reason daily digest and contest alerts never send**.

**The chain of failure:**

1. Contest providers (`Clist.js:48`, `MultiScraper.js:39`) return contests with **`startTime`** (camelCase):
   ```js
   return { startTime: startTime.toISOString(), ... }
   ```

2. The `algorithm.js` scoring/sorting uses **`startTime`** (camelCase) throughout (lines 109, 131).

3. The `/api/contests` route returns the processed contests — all with **`startTime`** field.

4. **BUT** the cron route at `app/api/cron/send-emails/route.ts:75` filters using:
   ```ts
   const startTime = new Date(contest.start_time);  // ← snake_case = UNDEFINED
   ```

5. `new Date(undefined)` → `Invalid Date` → filter **always returns empty array** → `sendDailyContestDigest()` is never called → **zero emails sent**.

**Same bug exists in:**
- `app/api/test-email/route.ts:69` — `contest.start_time` should be `contest.startTime`
- `app/lib/email/emailService.ts:8` — The `Contest` interface defines `start_time: string` but should be `startTime: string`
- `app/lib/email/emailService.ts:164,167` — `formatDate(contest.start_time)` and `formatTime(contest.start_time)` reference wrong field

**Fix required in 3 files:**
| File | Line(s) | Change |
|------|---------|--------|
| `app/api/cron/send-emails/route.ts` | 75 | `contest.start_time` → `contest.startTime` |
| `app/api/test-email/route.ts` | 69 | `contest.start_time` → `contest.startTime` |
| `app/lib/email/emailService.ts` | 8, 164, 167 | `start_time` → `startTime` |

---

### BUG #2: `NEXT_PUBLIC_APP_URL` = `localhost` on Vercel

**File:** `.env:3`
```
NEXT_PUBLIC_APP_URL=http://localhost:3000/
```

`NEXT_PUBLIC_*` variables are inlined at **build time** by Next.js. On Vercel, the cron route at `app/api/cron/send-emails/route.ts:55-56` does:
```ts
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const contestsResponse = await fetch(`${appUrl}/api/contests`);
```

This resolves to `http://localhost:3000/api/contests` on Vercel → **fetch fails** → `"Failed to fetch contests"` error → cron throws.

The same issue affects `emailService.ts:236,240,247,317` where `NEXT_PUBLIC_APP_URL` is used in email template links — users would see `localhost:3000` links in emails.

**Fix required:**
1. Set `NEXT_PUBLIC_APP_URL` to the actual Vercel deployment URL (e.g., `https://dsaquest.vercel.app`) in Vercel dashboard env vars.
2. The `|| "http://localhost:3000"` fallback is fine for local dev, but the Vercel env var must override it.

---

### BUG #3: Vercel Cron Auth May Fail Without `CRON_SECRET` Env Var

**File:** `app/api/cron/send-emails/route.ts:22`
```ts
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`)
```

Vercel Cron sends its own `Authorization` header using the secret configured in the Vercel dashboard. If `CRON_SECRET` is not set as a Vercel env var (separate from `.env`), then `process.env.CRON_SECRET` is `undefined` and the comparison always fails → **401 Unauthorized**.

**Fix required:**
1. Set `CRON_SECRET` as an env var in the Vercel dashboard (Settings → Environment Variables).
2. Use the same value that's in `.env`: `2k6A69g3ls5lNDx2COsaoCmHp8XbkxL2Ys3a0gir7ws`.

---

### BUG #4: Welcome Email — Fire-and-Forget Without Error Propagation

**File:** `app/auth/callback/route.ts:75-99`
```ts
sendWelcomeEmail(userEmail, userName)
  .then((result) => { ... })
  .catch((err) => console.error('❌ Welcome email error:', err))
```

The welcome email is sent as fire-and-forget (no `await`). While this is intentional to avoid blocking the redirect, there are two issues:

1. **If SMTP fails**, the error is only logged to console — no retry, no user feedback.
2. **The `email_logs` insert** (lines 79, 89) also has no error handling — if Supabase insert fails, it silently crashes.
3. **The `new user` detection** (line 52) uses a 10-second window: `secondsSinceCreation < 10`. If the OAuth flow takes >10 seconds (slow network, Supabase latency), the user is treated as "existing" and no welcome email is sent.

**Fix required:**
1. Increase the new user detection window from 10s to 60s (or use a `has_received_welcome` flag in user_profiles).
2. Add try/catch around the `email_logs` insert calls.
3. Consider adding a retry queue or at minimum logging to a more persistent store.

---

### BUG #5: No GitHub Actions Workflow Exists

The original report mentioned a GitHub Actions cron at `.github/workflows/daily-email-cron.yml`, but **this file does not exist** in the repository. There is no backup cron trigger — the only cron is the Vercel one in `vercel.json`.

This means:
- If Vercel cron fails (auth issue, timeout, etc.), there's **no fallback**.
- The "sometimes works" behavior is likely from manual testing via `/api/test-email`, not from any automated cron.

**Fix required:**
1. Create `.github/workflows/daily-email-cron.yml` as a backup cron trigger.
2. Or switch to a free external cron service (cron-job.org, cronkit.co) that can hit the endpoint daily.

---

### BUG #6: Vercel Hobby Plan — 10 Second Timeout

On Vercel Hobby, serverless functions time out at **10 seconds**. The cron route:
1. Fetches users from Supabase (fast)
2. Fetches contests by calling `/api/contests` (slow — calls 9+ external APIs)
3. Sends emails with 3 retries × exponential backoff

Step 2 alone could take 10+ seconds since it calls Clist, LeetCode, Codeforces, CodeChef, etc. The in-memory cache (`cache.ts`) isn't shared between serverless instances, so the cron's fetch always cold-calls all APIs.

**Fix required:**
1. In the cron route, call the contest fetching logic **directly** instead of self-fetching `/api/contests` (avoids spawning a separate serverless function).
2. Or use Vercel's `export const maxDuration = 30` (requires Pro plan).
3. Or use an external contest API/webhook that pre-fetches and stores contest data.

---

### BUG #7: Gmail SMTP Spam Blocking

The SMTP config uses a personal Gmail account (`foodhubservice123@gmail.com`). Gmail:
- Has a **~500 emails/day** limit for free accounts
- Flags bulk-sent emails from personal accounts as **spam**
- No SPF/DKIM/DMARC records possible for `gmail.com` domain

**Fix options (pick one):**
| Option | Cost | Effort | Reliability |
|--------|------|--------|-------------|
| **A. Resend (recommended)** | Free tier: 100 emails/day, 3000/month | Low — simple API | High |
| **B. Mailgun** | Free tier: 500 emails/month | Medium | High |
| **C. Brevo (Sendinblue)** | Free tier: 300 emails/day | Medium | High |
| **D. AWS SES** | $0.10/1000 emails | High (AWS setup) | Very High |
| **E. Keep Gmail** | Free | None | Low (spam issues) |

**Recommended: Resend** — Modern, simple API, free tier sufficient for current user base, handles deliverability.

---

## Complete Fix Plan

### Phase 1: Critical Code Fixes (Do First)

| # | File | Change | Impact |
|---|------|--------|--------|
| 1 | `app/api/cron/send-emails/route.ts:75` | `contest.start_time` → `contest.startTime` | Unblocks daily digest |
| 2 | `app/api/test-email/route.ts:69` | `contest.start_time` → `contest.startTime` | Unblocks test digest |
| 3 | `app/lib/email/emailService.ts:8,164,167` | `start_time` → `startTime` in interface + template refs | Fixes email template rendering |
| 4 | `.env` + Vercel dashboard | Set `NEXT_PUBLIC_APP_URL` to actual Vercel URL | Fixes internal fetch on Vercel |
| 5 | Vercel dashboard | Set `CRON_SECRET` env var | Fixes cron auth |

### Phase 2: Reliability Improvements

| # | File | Change | Impact |
|---|------|--------|--------|
| 6 | `app/auth/callback/route.ts:52` | Increase new-user window from 10s → 60s | Catches more new users for welcome email |
| 7 | `app/auth/callback/route.ts:79,89` | Wrap `email_logs` inserts in try/catch | Prevents silent crashes |
| 8 | `app/api/cron/send-emails/route.ts` | Import contest fetching logic directly instead of self-fetching `/api/contests` | Avoids timeout + extra serverless function |
| 9 | Create `.github/workflows/daily-email-cron.yml` | Backup cron trigger | Prevents silent cron failures |

### Phase 3: Email Delivery Upgrade

| # | Change | Impact |
|---|--------|--------|
| 10 | Replace Gmail SMTP with Resend API | Better deliverability, no spam issues, professional sending |
| 11 | Update `emailService.ts` to use Resend SDK instead of nodemailer | Cleaner code, better error handling |
| 12 | Add email preference checks for contest alerts vs digest | Currently only one `email_notifications` flag controls everything |

### Phase 4: Nice-to-Have

| # | Change | Impact |
|---|--------|--------|
| 13 | Add `has_received_welcome` column to `user_profiles` | More reliable welcome email detection |
| 14 | Wire up "Weekly Digest" and "Product Updates" toggles in settings | Currently UI-only, not connected to backend |
| 15 | Add email preview/unsubscribe links | Professional email compliance |

---

## Quick Verification After Fixes

After applying Phase 1 fixes, test in this order:

1. **Test welcome email locally:**
   ```
   GET http://localhost:3000/api/test-email?type=welcome
   ```
   Should return `success: true` and email should arrive.

2. **Test digest email locally:**
   ```
   GET http://localhost:3000/api/test-email?type=digest
   ```
   Should return contest list and send digest.

3. **Test cron endpoint locally:**
   ```bash
   curl -X GET http://localhost:3000/api/cron/send-emails \
     -H "Authorization: Bearer 2k6A69g3ls5lNDx2COsaoCmHp8XbkxL2Ys3a0gir7ws"
   ```
   Should return sent/failed/skipped counts.

4. **Check Vercel deployment:**
   - Verify `NEXT_PUBLIC_APP_URL` is set correctly in Vercel env vars
   - Verify `CRON_SECRET` is set in Vercel env vars
   - Wait for next cron trigger or manually trigger from Vercel dashboard

---

## Priority Order

**Do these today:**
1. Fix `start_time` → `startTime` in all 3 files (5 minutes)
2. Set Vercel env vars for `NEXT_PUBLIC_APP_URL` and `CRON_SECRET` (2 minutes)
3. Test with `/api/test-email?type=welcome` and `?type=digest`

**Do this week:**
4. Increase welcome email detection window
5. Add error handling to fire-and-forget email logging
6. Create GitHub Actions backup cron

**Do when ready:**
7. Migrate from Gmail SMTP to Resend




**After solution report **

Files Modified (7 files)
Bug Fixes
app/lib/email/emailService.ts — Complete rewrite
- Fixed Contest interface: start_time → startTime
- All 4 email templates rewritten with low-spam format
- Table-based HTML layout (not div-based) for better email client compatibility
- Added List-Unsubscribe, Precedence: bulk, X-Mailer headers for Gmail trust
- Plain text fallback auto-generated from HTML
- Physical address in footer, manage preferences link, legal disclaimer
- New functions: sendContestAlert(), sendProductUpdate()
app/api/cron/send-emails/route.ts — Rewritten
- Fixed contest.start_time → contest.startTime
- Now imports contest providers directly instead of self-fetching /api/contests (avoids extra serverless function + timeout risk)
- Falls back to HTTP fetch if direct import fails
app/api/test-email/route.ts — Rewritten
- Fixed contest.start_time → contest.startTime
- Added test types: ?type=alert, ?type=product
- All 4 types testable: welcome, digest, alert, product
app/auth/callback/route.ts — Fixed
- New user detection window: 10s → 60s (catches slow OAuth flows)
- Added void to fire-and-forget Supabase inserts (prevents unhandled promise)
app/dashboard/settings/page.tsx — Wired up toggles
- Notification toggles now load from backend on mount
- Changes auto-save via PATCH /api/user/profile
- Toggles disabled while save is in progress
app/api/user/profile/route.ts — Extended
- Accepts weekly_digest and product_updates fields in PATCH
New Files
.github/workflows/daily-email-cron.yml — Improved
- Better error handling with HTTP status checks
- Response body validation
- Timeout protection
How to Test
After deploying, test each email type:
GET /api/test-email?type=welcome
GET /api/test-email?type=digest
GET /api/test-email?type=alert
GET /api/test-email?type=product
Gmail Reliability for 25 Users
With the new templates (text-focused, proper headers, unsubscribe link, physical address, Precedence: bulk header), Gmail deliverability should be fine for 25 users. The key anti-spam measures added:
- List-Unsubscribe header
- Precedence: bulk marking
- Plain text version alongside HTML
- No image-heavy design
- Physical address in footer
- No link shorteners
- Real content URLs only
Database Note
The weekly_digest and product_updates fields will only work if you add those columns to the user_profiles table in Supabase. Until then, the Contest Alerts toggle is fully wired to the existing email_notifications column.