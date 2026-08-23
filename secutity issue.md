
`contest-tracker` is a Next.js App Router project branded as DSA Quest. It tracks programming contests, provides a public resources/blogs area, supports authenticated dashboards, creator writing flow, uploaded editor assets, comments, upvotes, admin review, notifications, Supabase user profiles/auth, MongoDB-backed resources/comments/notifications, and scheduled email digests.

Backend stack observed: Next.js API routes, Supabase SSR auth, Supabase Storage, MongoDB/Mongoose, Nodemailer, third-party contest APIs.

**Critical Security Issues**
1. **Mass assignment lets users modify protected resource fields.**  
   The document update API verifies ownership, then applies the entire request body with `$set: body`: [route.ts](<E:/projects/contest-tracker/app/api/documents/[id]/route.ts:31>). A resource owner can likely set `status: "published"`, alter `userId`, `upvotes`, `views`, `authorEmail`, `rejectionReason`, etc. This can bypass moderation and corrupt ownership/integrity.

2. **Frontend route protection depends heavily on middleware, but the installed Next.js version has relevant auth-bypass advisories.**  
   Active middleware protects `/dashboard`: [middleware.ts](E:/projects/contest-tracker/middleware.ts:37). `npm audit --omit=dev` reports vulnerable `next` as a direct dependency. The current `next@16.1.2` is within GitHub’s affected range for middleware/proxy bypass in App Router apps: [GHSA-26hh-7cqf-hhc6](https://github.com/vercel/next.js/security/advisories/GHSA-26hh-7cqf-hhc6). This is especially serious because this project uses middleware for dashboard access control.

3. **Upload endpoint is over-privileged and under-validated.**  
   Authenticated users can upload arbitrary file content; extension and MIME type come from the client: [route.ts](E:/projects/contest-tracker/app/api/upload/route.ts:15). The API uses Supabase service role: [route.ts](E:/projects/contest-tracker/app/api/upload/route.ts:27), creates a public bucket on demand: [route.ts](E:/projects/contest-tracker/app/api/upload/route.ts:40), and returns public URLs: [route.ts](E:/projects/contest-tracker/app/api/upload/route.ts:65). Missing server-side type validation, malware checks, safe extension allowlist, per-user quota, and pre-read size limits.

4. **Role model is confused and partly user-influenced.**  
   The auth callback accepts `role` from URL for new users and writes it to metadata/profile: [route.ts](E:/projects/contest-tracker/app/auth/callback/route.ts:57). Root middleware uses `user_metadata.role` for dashboard redirects: [middleware.ts](E:/projects/contest-tracker/middleware.ts:47). There is also a second unused middleware implementation with different behavior. This makes authorization intent unclear.

5. **Hard-coded API credentials exist in source.**  
   CLIST username/API key fallbacks are embedded in provider files: [Clist.js](E:/projects/contest-tracker/app/api/contests/providers/Clist.js:3). I am intentionally not repeating the key. Even fallback secrets in source should be considered compromised once committed or shared.

6. **Public contest endpoint can be abused for backend load.**  
   `/api/contests` is public and triggers multiple external requests. Some providers have no timeout, no rate limit, no authentication, and only in-memory cache. Attackers can force third-party fetch load and serverless execution cost.

7. **Cookie-authenticated mutation APIs lack explicit CSRF/origin protection.**  
   Several state-changing routes rely on Supabase cookies through `createClient()` but do not check `Origin`, `Referer`, CSRF token, or request intent. Examples include document update, upload, profile update, notifications read, and admin actions.

8. **Stored editor HTML is trusted too broadly.**  
   Resource content is persisted as HTML and later parsed/rendered by the client: [page.tsx](<E:/projects/contest-tracker/app/resources/[id]/page.tsx:87>). I did not find a clear server-side sanitizer such as DOMPurify. Tiptap reduces some risk, but production systems should sanitize persisted rich text at the boundary.

**Frontend URL Protection**
The frontend is not a security boundary. The root middleware only guards `/dashboard` paths and redirects unauthenticated users. API routes have mixed protection: some are public by design, some use Supabase cookie auth, some use bearer tokens, and admin routes use `SUPERADMIN_EMAILS`: [route.ts](E:/projects/contest-tracker/app/api/admin/pending/route.ts:12). `app/components/ProtectedRoute.tsx` appears empty, so client-side route protection is effectively absent or unused.

**Why Not Production Ready**
- `npm run build` fails. Production build stops at `components/dashboard/DashboardNavbar.tsx` because `pathname` is undefined: [DashboardNavbar.tsx](E:/projects/contest-tracker/components/dashboard/DashboardNavbar.tsx:26).
- `npm run lint` fails with 228 problems: 90 errors and 138 warnings.
- `npm audit --omit=dev` reports 4 production dependency vulnerabilities: 3 high, 1 moderate. Direct vulnerable packages include `next` and `nodemailer`.
- Security headers are not configured; `next.config.ts` is effectively empty.
- No visible rate limiting, request size policy, abuse throttling, centralized authorization, structured validation, or production logging/audit strategy.
- Moderation can likely be bypassed through the document mass-assignment bug.
- Upload handling is not safe enough for public production use.
- There are environment/secret hygiene issues, including hard-coded third-party API fallback credentials.
- Database/RLS setup appears partial and not enough to prove least-privilege production posture.

This maps strongly to OWASP Broken Access Control risk: [OWASP A01](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/). In plain terms: the app has useful product shape, but the authorization, dependency, upload, and build posture are not production-grade yet.