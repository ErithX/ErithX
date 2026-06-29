# Superadmin And Dynamic Resources V1

## Summary
Implement an isolated resources approval system without redesigning the existing app. Add `/superadmin`, `/resources/submit`, dynamic approved resources, and clear resource detail pages like GFG/Reddit posts.

Research references: [DEV Editor Guide](https://dev.to/p/editor_guide), [MDN file input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file), [USWDS file input](https://designsystem.digital.gov/components/file-input/), [Next route handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route), [Supabase admin listUsers](https://supabase.com/docs/reference/javascript/auth-admin-listusers), [MongoDB GridFS](https://www.mongodb.com/docs/drivers/node/current/crud/gridfs/).

## Key Changes
- Create empty `.env` for you to fill later.
- Add MongoDB support for resource submissions and optional files.
- Keep Supabase for auth and user fetching.
- Add env keys expected by code:
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPERADMIN_EMAILS`, `MONGODB_URI`, `MONGODB_DB`, `NEXT_PUBLIC_APP_URL`.
- Resource fields:
  `title`, `body`, `tags`, `resourceType`, `category`, `linkUrl`, `imageUrl`, `attachmentId`, `attachmentName`, `attachmentType`, `slug`, `status`, `source`, `submittedBy`, `createdAt`, `updatedAt`, `approvedAt`, `approvedBy`.
- Mandatory: `title`, `body`, `tags`.
- Optional: PDF/file upload, image URL, external link URL.

## Implementation
- User side:
  - Add `Submit your resource` button on existing `/resources`.
  - Open `/resources/submit` as a full page, not a modal.
  - Require login before submit.
  - Submission form accepts title, body, tags, type/category, optional URL, optional image URL, optional file.
  - After submit, show pending confirmation.
- Resources page:
  - Keep existing static sections.
  - Add “Latest Community Resources” from approved MongoDB resources.
  - Cards show title, tags, short body preview, type, and submitted/approved date.
  - Clicking any dynamic blog/resource opens `/resources/[slug]`.
- Detail page:
  - Add `/resources/[slug]`.
  - Display title, tags, full body, optional image, optional attachment download, optional external link.
  - External links open in a new tab; internal detail page opens normally.
- Admin side:
  - Add `/superadmin`.
  - Admin access uses `SUPERADMIN_EMAILS`.
  - Tabs: Users, Pending Resources, Approved Resources, Create Resource.
  - Users tab lists all Supabase users sorted by signup time newest-first.
  - Pending tab previews submissions and supports approve/reject.
  - Create Resource lets admin publish directly to resources page.
- APIs:
  - `GET /api/resources`
  - `POST /api/resources`
  - `GET /api/resources/[slug]`
  - `GET /api/resources/[id]/file`
  - `GET /api/superadmin/users`
  - `GET /api/superadmin/resources`
  - `POST /api/superadmin/resources`
  - `PATCH /api/superadmin/resources/[id]`

## Test Plan
- Submit text + tags only.
- Submit text + tags + link.
- Submit text + tags + PDF.
- Approve and confirm resource appears on `/resources`.
- Click approved resource and confirm `/resources/[slug]` opens clearly.
- Confirm non-admin cannot open `/superadmin`.
- Confirm users sort by signup time.
- Run `npm run lint` and `npm run build` after env values are filled.

## Assumptions
- Use `/superadmin` route, with files grouped under the app folder, instead of a literal public folder named `superadminfolder`.
- MongoDB GridFS is used for optional PDFs/images/files.
- Comments stay short and only around important functions.
