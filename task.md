# DSA Quest - Publishing Checklist

## Phase 1 (Immediate Launch Target)
**Goal:** Bring creators onboard, fill up the resources page, and provide a seamless core experience.

- [x] **Clean Up Professional Dashboard**
  - [x] Remove non-functional links and options.
  - [x] Simplify navigation to just Overview and Content Manager.
- [x] **Establish Draft / Publishing System**
  - [x] Create the `write` page functionality for creators.
  - [x] Implement save to draft, publish, and edit flows using Supabase/MongoDB.
  - [x] Create premium "Pending Approval" page.
- [x] **Typography Fixes**
  - [x] Update `.tiptap` and `.article-body` in `app/globals.css` to match `Editor.html`.
- [x] **Unified Dashboard Architecture**
  - [x] Add "Creator Studio" link in the user dropdown.
  - [x] Rename `Professional Dashboard` to `Creator Studio` in UI.
- [x] **Views & Dynamic Data Cleanup**
  - [x] Implement impression-based views algorithm.
  - [x] Sort Top Performing by views.
  - [x] Link to real data for Total Reach & Upvotes.
  - [x] Hide unused features & add draft delete option.
- [x] **Route Security**
  - [x] Professionals redirect from `/dashboard` to `/dashboard/pro`.
  - [x] Students can access both `/dashboard` and `/dashboard/pro`.
  - [x] Secure `/dashboard/write/pending` page.
- [x] **Refine Landing Page**
  - Replace all remaining `picsum.photos` and dummy text with actual dynamic platform data or realistic static assets.
- [x] **Redesign Navbar Platforms Dropdown into Serious SaaS Mega-Dropdown**
- [x] **Growth Hacks: Urgency & Social Proof (Phase 1 Implemented)**
  - Dynamic timers and contest stats integrated.

## Phase 2 & Beyond (Post-Launch)
**Goal:** Enhance engagement, social features, and gamification.

- [ ] **Tag-Based Content Suggestions**
  - Recommend resources based on tags the user frequently views or contests they participate in.
- [ ] **Follow / Unfollow System**
  - Allow students to follow specific creators and get notified of their new resources.
- [ ] **Token / Reward System**
  - Introduce tokens for completing small tasks (viewing resources, daily logins).
  - Create a redemption center.
- [ ] **Advanced Dashboard Analytics**
  - Build out the Skill Map, Weekly Review, and Achievement Sections that were hidden in Phase 1.
- [x] **SEO Overhaul (Completed)**
  - `[x]` Update `app/layout.tsx` metadata.
  - `[x]` Add direct metadata to static pages (`app/page.tsx`, `app/contests/page.tsx`, `app/resources/page.tsx`, `about`, `faq`, `contact`, `privacy`, `terms`).
  - `[x]` Rewrite `app/sitemap.ts`.
  - `[x]` Rewrite `app/robots.ts`.
  - `[x]` Create `public/llms.txt`.
  - `[x]` Add Schema Markup (`json-ld`) to `app/page.tsx` and `app/faq/page.tsx`.
  - [x] Fix dummy PRO badge removal on `Settings` page.
  - [x] Safely merge `version-3` to `main` branch.
  - `[x]` Fix H1 tags in dashboard pages.
- [x] **Dynamic Resource Metadata**
  - `[x]` Create `app/resources/[id]/layout.tsx` to handle dynamic metadata for resources.

## New Backend & Profile Tasks
- [x] **Creator Dashboard & Settings Page Aesthetics**
  - Redesign settings profile page with clean dark theme and transparent fields.
  - Add verified fields for Bio, X (Twitter), LinkedIn, and Coding Profiles.
- [ ] **Settings Page Deferred Tasks**
  - Future: Implement Profile Picture & Banner upload in settings.
  - Future: Implement Contest Preferences (Favorite Platforms filtering and Custom Alert Times).
- [ ] **MongoDB User Schema & API**
  - Create `User` model (supabaseId, name, bio, social links, isPro, isVerified).
  - Create `/api/profile` to handle fetching and updating user data.
- [ ] **Global Public Profiles**
  - Create SEO-friendly `/user/[username]` pages.
  - Implement dynamic OpenGraph meta tags for user profiles.
- [ ] **Verification Badge & Top Contributors**
  - Add blue/green verified tick for official/pro accounts on Resource cards.
  - Show actual user Bio and Social Links directly in the Top Contributors sidebar.
- [x] **Cold Start Seeding (Growth Hack)**
  - Write a seed script (`seedUsers.mjs`) to inject "Ambassador" User profiles directly into MongoDB.
  - Setup an "Official Verified Account" (e.g. DSA Quest) for premium resources.
  - Build logic to allow posting resources on behalf of these seeded bot accounts (`overrideAuthorId`).
- [x] Backend Image Compression
- [x] Cache Resources

## Image Optimization & SEO Tasks
- [x] Convert standard `<img>` tags to Next.js `<Image>` component for main Landing Page images (Hero section, Ecosystem, Manifesto, Journey, etc.).
- [x] **Dynamic Alt Text Implementation**: When a user uploads a cover image or resource image in the dashboard, either (A) prompt the user with a mandatory 'Alt Text' input field to describe the image manually, OR (B) use an AI API (like Google Gemini Vision) in the backend to auto-generate descriptive alt text from the image buffer before saving. Save this generated/inputted `alt_text` alongside the image URL in the MongoDB/Supabase database. Update frontend components (`<img alt={item.alt_text} />`) to render it.
- [x] Configure `next.config.mjs` with proper remote patterns (domains) to support external images in `next/image` (proper image routing).

## Recent UI & SSR Tweaks
- [x] Step 1: Fix build errors (Dynamic server usage in app/contests)
- [x] Step 2: Fix missing property errors in DsaContestCard interface
- [x] Step 5: Refactor /resources feed to Server-Side Rendering (SSR)
  - [x] Convert /resources feed page to SSR to solve Google grabbing footer text for snippets
  - [x] Added OpenGraph `images` metadata support to resource[id] pages for social sharing/[id]/page.tsx`
- [x] Step 4: UI and Functionality Tweaks
  - [x] Remove Atcoder icon from contest page hero section
  - [x] Modify Horizontal scrollbar in Live Now contests to be thin and green themed
  - [x] Make 'view all contests' (for both live & upcoming) functional

## Backlog (For Later Implementation)
- `[ ]` Refactor main `/resources` feed page to Server-Side Rendering (SSR) to eliminate initial loading spinner.
 [x] Add the Calender data related frontend implementation plan
 [x] Execute the Calendar data related frontend implementation plan

Remaining Vital tasks on 25/07/2026

 1.[x] Fixing Broken security in backend & Critical internal bugs [secutity issue.md]
 2.[x] Fixing Broken cron job & email infrastructure for user retention (added weekly_digest & product_updates fields to user_profiles and created 4 HTML preview templates: welcome, digest, alert, product) [Cron-Job report.md, Email-Fix-Solution.md]
 3.Add hidden admin level analytics to track Views & calender adding event
 4. Do Nothing & Sleep

## AI Discoverability, Feature Docs, Competitor Comparisons & Brand Vibe Overhaul
- [x] **Pillar 1: AI-Discoverability & Calendar Feature Spotlight**
  - Updated `public/llms.txt` with 1-Click Calendar Sync specifications, timezone conversion, competitor comparison matrix (vs Clist & CodeClock), and 2026+ practical career readiness focus.
  - Injected rich JSON-LD `WebApplication` schema markup in `app/page.tsx` with featureList and AI-discoverable metadata.
  - Removed all academic ("B.Tech", "PYQ") references from layout metadata and `public/llms.txt`.
- [x] **Pillar 2: Official Feature Vault (`/features`) & Typography Overhaul**
  - Built polished `app/features/page.tsx` matched strictly to the clean typography and design system of `UI/landing.html` & `UI/Terms&condition.html`.
  - Linked `/features` in `Navbar.tsx`, `Footer.tsx`, and `app/sitemap.ts`.
- [x] **Pillar 3: Competitor Comparison (UI-Free AI Ingestion)**
  - Embedded competitive comparison matrix (DSA Quest vs Clist & CodeClock) directly into `public/llms.txt` and `schema.org` data for LLM crawlers (Perplexity, ChatGPT, Gemini, Claude).
- [x] **Pillar 4: Platform Documentation Hub (`/docs`)**
  - Built `app/docs/page.tsx` following the clean documentation layout and typography of `UI/Terms&condition.html`.
  - Linked `/docs` in `Navbar.tsx`, `Footer.tsx`, and `app/sitemap.ts`.
- [x] **Clean Navbar Architecture & Platform Dropdown**
  - Refactored `Navbar.tsx` with interactive `Platform ▾` dropdown containing Features, Docs, Contact Us, About Us, and FAQ.
  - Hidden `Dashboard` link for logged-out users; retained `FAQ` on top navbar.
- [x] **Pillar 5: Brand Vibe & Mindset Rules**
  - Persisted platform vibe guidelines and copy restrictions in `.agents/AGENTS.md`.


## Preparation for Open Sourcing
- [ ] Codebase cleanup and secret management review (We need to open source this project later carefully).

## Critical Bug Fixes & Reliability Backlog (August 2026)
- [x] **Email System Reliability (Gmail App Password Restored)**
  - Updated fresh 16-character Gmail App Password in `.env`. Successfully verified SMTP authentication and delivered test emails.

- [x] **Resource Card Cover Images Re-Enablement**
  - Re-enabled cover image rendering in `BlogsCard.tsx` and `ResourceCard.tsx` with lazy loading & clean fallback.
- [x] **Views Tracking Synchronization**
  - Fixed `app/api/resources/[id]/view/route.ts` to increment `views` & `realViews`, handle slug lookups, and display `realViews` across all UI cards & pages.
- [x] **Draft Date Synchronization on Publish**
  - Updated `app/api/admin/pending/[id]/route.ts` to set `createdAt` to current time upon approval, fixing "posted 9 days ago" on fresh posts.
- [x] **Superadmin Real-Time Presence & Heartbeat Tracking**
  - Implemented client heartbeat (`UserHeartbeat.tsx`) + server endpoint (`/api/user/heartbeat`) + multi-dimensional sorting and live `🟢 Online` badges on Superadmin.
- [x] **Internal Engagement Telemetry & Live User Intent Stream**
  - Implemented `PlatformMetric` and `UserActivity` models + `/api/analytics/track` + `/api/superadmin/metrics`.
  - Added Live Intent Stream in Superadmin displaying user avatars, names, emails, specific contest/blueprint targets, action badges, and category filtering.
- [x] **Clean Bug Fixes & Telemetry Git Sync**
  - Stashed, wiped hurried commit, cleanly merged and pushed bug fixes to `origin/version-3`.

## Version 3 Execution (The AI Reviewer & Coder Identity Engine)
- **Philosophy**: Build it from scratch optimally. This feature is Art, Mastery, Melody. Others should think it cannot be done by AI alone.
- [x] **Milestone 1: Live Profile Linking & Real-Time Edge Verifier**
  - Built `UserCoderProfile` MongoDB model & `/api/user/profiles` CRUD endpoint.
  - Engineered `/api/user/profiles/verify` supporting real-time edge lookups for GitHub, LeetCode (GraphQL), and Codeforces.
  - Implemented `<ProfileLinkModal />` with debounced micro-spinners, live verified badges, and real avatar previews.
  - Integrated dynamic `<ConnectedProfilesCard />` on `/dashboard` with live sync indicators.
- [ ] **Milestone 2: Platform Snapshot Scrapers & Deterministic Delta Engine**
  - [x] Create MongoDB schemas (`models/PlatformStats.ts`) for LeetCode, Codeforces, GitHub, CodeChef.
  - [x] Build API fetchers (`app/lib/platform-fetchers.ts`) for each platform.
  - [x] Implement the Weekly Cron Job endpoint (`app/api/cron/fetch-stats/route.ts`) to fetch all users sequentially.
  - [x] Deterministic progress rules filter (Δ active days, Δ contest rating, Δ hard/medium solves, slacking streaks).
- [ ] **Milestone 3: AI Reviewer LLM Reasoning Engine & Superadmin Audit Hub**
  - [x] Brutally honest senior engineer persona with dynamic tone variation and open loop assignments (`services/ai/prompts.ts`).
  - [x] Multi-tier provider fallback router (Llama 3.3 70B ⇄ Gemini 2.5 Flash ⇄ GLM/Nemotron) (`services/ai/reviewerRouter.ts`).
  - [x] AI Review database persistence layer, memory state tracking, and query service (`models/AIReview.ts`, `services/ai/reviewStorage.ts`).
  - [x] Context assembler cron endpoint connecting platform snapshots + previous review memory into LLM router (`app/api/cron/generate-reviews/route.ts`).
  - [ ] User review timeline card & Pro trend graph UI on `/dashboard`.
- [ ] **Bonus Milestone: GitHub Weekly Tracking**
  - [ ] Update `models/PlatformStats.ts` for GithubStats recent events.
  - [ ] Update `app/lib/platform-fetchers.ts` to fetch `/events/public`.
- [ ] Update `services/core/dataFilter.ts` to calculate weekly/monthly contributions.
  - [ ] Update docs.

## Upcoming Marketing & Platform Tasks (Next Sprint)
- [ ] **ErithX Rebranding Email Campaign**
  - Prepare a "First Email" template for users announcing the transition from DSA Quest to ErithX.
# DSA Quest - Publishing Checklist

## Phase 1 (Immediate Launch Target)
**Goal:** Bring creators onboard, fill up the resources page, and provide a seamless core experience.

- [x] **Clean Up Professional Dashboard**
  - [x] Remove non-functional links and options.
  - [x] Simplify navigation to just Overview and Content Manager.
- [x] **Establish Draft / Publishing System**
  - [x] Create the `write` page functionality for creators.
  - [x] Implement save to draft, publish, and edit flows using Supabase/MongoDB.
  - [x] Create premium "Pending Approval" page.
- [x] **Typography Fixes**
  - [x] Update `.tiptap` and `.article-body` in `app/globals.css` to match `Editor.html`.
- [x] **Unified Dashboard Architecture**
  - [x] Add "Creator Studio" link in the user dropdown.
  - [x] Rename `Professional Dashboard` to `Creator Studio` in UI.
- [x] **Views & Dynamic Data Cleanup**
  - [x] Implement impression-based views algorithm.
  - [x] Sort Top Performing by views.
  - [x] Link to real data for Total Reach & Upvotes.
  - [x] Hide unused features & add draft delete option.
- [x] **Route Security**
  - [x] Professionals redirect from `/dashboard` to `/dashboard/pro`.
  - [x] Students can access both `/dashboard` and `/dashboard/pro`.
  - [x] Secure `/dashboard/write/pending` page.
- [x] **Refine Landing Page**
  - Replace all remaining `picsum.photos` and dummy text with actual dynamic platform data or realistic static assets.
- [x] **Redesign Navbar Platforms Dropdown into Serious SaaS Mega-Dropdown**
- [x] **Growth Hacks: Urgency & Social Proof (Phase 1 Implemented)**
  - Dynamic timers and contest stats integrated.

## Phase 2 & Beyond (Post-Launch)
**Goal:** Enhance engagement, social features, and gamification.

- [ ] **Tag-Based Content Suggestions**
  - Recommend resources based on tags the user frequently views or contests they participate in.
- [ ] **Follow / Unfollow System**
  - Allow students to follow specific creators and get notified of their new resources.
- [ ] **Token / Reward System**
  - Introduce tokens for completing small tasks (viewing resources, daily logins).
  - Create a redemption center.
- [ ] **Advanced Dashboard Analytics**
  - Build out the Skill Map, Weekly Review, and Achievement Sections that were hidden in Phase 1.
- [x] **SEO Overhaul (Completed)**
  - `[x]` Update `app/layout.tsx` metadata.
  - `[x]` Add direct metadata to static pages (`app/page.tsx`, `app/contests/page.tsx`, `app/resources/page.tsx`, `about`, `faq`, `contact`, `privacy`, `terms`).
  - `[x]` Rewrite `app/sitemap.ts`.
  - `[x]` Rewrite `app/robots.ts`.
  - `[x]` Create `public/llms.txt`.
  - `[x]` Add Schema Markup (`json-ld`) to `app/page.tsx` and `app/faq/page.tsx`.
  - [x] Fix dummy PRO badge removal on `Settings` page.
  - [x] Safely merge `version-3` to `main` branch.
  - `[x]` Fix H1 tags in dashboard pages.
- [x] **Dynamic Resource Metadata**
  - `[x]` Create `app/resources/[id]/layout.tsx` to handle dynamic metadata for resources.

## New Backend & Profile Tasks
- [x] **Creator Dashboard & Settings Page Aesthetics**
  - Redesign settings profile page with clean dark theme and transparent fields.
  - Add verified fields for Bio, X (Twitter), LinkedIn, and Coding Profiles.
- [ ] **Settings Page Deferred Tasks**
  - Future: Implement Profile Picture & Banner upload in settings.
  - Future: Implement Contest Preferences (Favorite Platforms filtering and Custom Alert Times).
- [ ] **MongoDB User Schema & API**
  - Create `User` model (supabaseId, name, bio, social links, isPro, isVerified).
  - Create `/api/profile` to handle fetching and updating user data.
- [ ] **Global Public Profiles**
  - Create SEO-friendly `/user/[username]` pages.
  - Implement dynamic OpenGraph meta tags for user profiles.
- [ ] **Verification Badge & Top Contributors**
  - Add blue/green verified tick for official/pro accounts on Resource cards.
  - Show actual user Bio and Social Links directly in the Top Contributors sidebar.
- [x] **Cold Start Seeding (Growth Hack)**
  - Write a seed script (`seedUsers.mjs`) to inject "Ambassador" User profiles directly into MongoDB.
  - Setup an "Official Verified Account" (e.g. DSA Quest) for premium resources.
  - Build logic to allow posting resources on behalf of these seeded bot accounts (`overrideAuthorId`).
- [x] Backend Image Compression
- [x] Cache Resources

## Image Optimization & SEO Tasks
- [x] Convert standard `<img>` tags to Next.js `<Image>` component for main Landing Page images (Hero section, Ecosystem, Manifesto, Journey, etc.).
- [x] **Dynamic Alt Text Implementation**: When a user uploads a cover image or resource image in the dashboard, either (A) prompt the user with a mandatory 'Alt Text' input field to describe the image manually, OR (B) use an AI API (like Google Gemini Vision) in the backend to auto-generate descriptive alt text from the image buffer before saving. Save this generated/inputted `alt_text` alongside the image URL in the MongoDB/Supabase database. Update frontend components (`<img alt={item.alt_text} />`) to render it.
- [x] Configure `next.config.mjs` with proper remote patterns (domains) to support external images in `next/image` (proper image routing).

## Recent UI & SSR Tweaks
- [x] Step 1: Fix build errors (Dynamic server usage in app/contests)
- [x] Step 2: Fix missing property errors in DsaContestCard interface
- [x] Step 5: Refactor /resources feed to Server-Side Rendering (SSR)
  - [x] Convert /resources feed page to SSR to solve Google grabbing footer text for snippets
  - [x] Added OpenGraph `images` metadata support to resource[id] pages for social sharing/[id]/page.tsx`
- [x] Step 4: UI and Functionality Tweaks
  - [x] Remove Atcoder icon from contest page hero section
  - [x] Modify Horizontal scrollbar in Live Now contests to be thin and green themed
  - [x] Make 'view all contests' (for both live & upcoming) functional

## Backlog (For Later Implementation)
- `[ ]` Refactor main `/resources` feed page to Server-Side Rendering (SSR) to eliminate initial loading spinner.
 [x] Add the Calender data related frontend implementation plan
 [x] Execute the Calendar data related frontend implementation plan

Remaining Vital tasks on 25/07/2026

 1.[x] Fixing Broken security in backend & Critical internal bugs [secutity issue.md]
 2.[x] Fixing Broken cron job & email infrastructure for user retention (added weekly_digest & product_updates fields to user_profiles and created 4 HTML preview templates: welcome, digest, alert, product) [Cron-Job report.md, Email-Fix-Solution.md]
 3.Add hidden admin level analytics to track Views & calender adding event
 4. Do Nothing & Sleep

## AI Discoverability, Feature Docs, Competitor Comparisons & Brand Vibe Overhaul
- [x] **Pillar 1: AI-Discoverability & Calendar Feature Spotlight**
  - Updated `public/llms.txt` with 1-Click Calendar Sync specifications, timezone conversion, competitor comparison matrix (vs Clist & CodeClock), and 2026+ practical career readiness focus.
  - Injected rich JSON-LD `WebApplication` schema markup in `app/page.tsx` with featureList and AI-discoverable metadata.
  - Removed all academic ("B.Tech", "PYQ") references from layout metadata and `public/llms.txt`.
- [x] **Pillar 2: Official Feature Vault (`/features`) & Typography Overhaul**
  - Built polished `app/features/page.tsx` matched strictly to the clean typography and design system of `UI/landing.html` & `UI/Terms&condition.html`.
  - Linked `/features` in `Navbar.tsx`, `Footer.tsx`, and `app/sitemap.ts`.
- [x] **Pillar 3: Competitor Comparison (UI-Free AI Ingestion)**
  - Embedded competitive comparison matrix (DSA Quest vs Clist & CodeClock) directly into `public/llms.txt` and `schema.org` data for LLM crawlers (Perplexity, ChatGPT, Gemini, Claude).
- [x] **Pillar 4: Platform Documentation Hub (`/docs`)**
  - Built `app/docs/page.tsx` following the clean documentation layout and typography of `UI/Terms&condition.html`.
  - Linked `/docs` in `Navbar.tsx`, `Footer.tsx`, and `app/sitemap.ts`.
- [x] **Clean Navbar Architecture & Platform Dropdown**
  - Refactored `Navbar.tsx` with interactive `Platform ▾` dropdown containing Features, Docs, Contact Us, About Us, and FAQ.
  - Hidden `Dashboard` link for logged-out users; retained `FAQ` on top navbar.
- [x] **Pillar 5: Brand Vibe & Mindset Rules**
  - Persisted platform vibe guidelines and copy restrictions in `.agents/AGENTS.md`.


## Preparation for Open Sourcing
- [ ] Codebase cleanup and secret management review (We need to open source this project later carefully).

## Critical Bug Fixes & Reliability Backlog (August 2026)
- [x] **Email System Reliability (Gmail App Password Restored)**
  - Updated fresh 16-character Gmail App Password in `.env`. Successfully verified SMTP authentication and delivered test emails.

- [x] **Resource Card Cover Images Re-Enablement**
  - Re-enabled cover image rendering in `BlogsCard.tsx` and `ResourceCard.tsx` with lazy loading & clean fallback.
- [x] **Views Tracking Synchronization**
  - Fixed `app/api/resources/[id]/view/route.ts` to increment `views` & `realViews`, handle slug lookups, and display `realViews` across all UI cards & pages.
- [x] **Draft Date Synchronization on Publish**
  - Updated `app/api/admin/pending/[id]/route.ts` to set `createdAt` to current time upon approval, fixing "posted 9 days ago" on fresh posts.
- [x] **Superadmin Real-Time Presence & Heartbeat Tracking**
  - Implemented client heartbeat (`UserHeartbeat.tsx`) + server endpoint (`/api/user/heartbeat`) + multi-dimensional sorting and live `🟢 Online` badges on Superadmin.
- [x] **Internal Engagement Telemetry & Live User Intent Stream**
  - Implemented `PlatformMetric` and `UserActivity` models + `/api/analytics/track` + `/api/superadmin/metrics`.
  - Added Live Intent Stream in Superadmin displaying user avatars, names, emails, specific contest/blueprint targets, action badges, and category filtering.
- [x] **Clean Bug Fixes & Telemetry Git Sync**
  - Stashed, wiped hurried commit, cleanly merged and pushed bug fixes to `origin/version-3`.

## Version 3 Execution (The AI Reviewer & Coder Identity Engine)
- **Philosophy**: Build it from scratch optimally. This feature is Art, Mastery, Melody. Others should think it cannot be done by AI alone.
- [x] **Milestone 1: Live Profile Linking & Real-Time Edge Verifier**
  - Built `UserCoderProfile` MongoDB model & `/api/user/profiles` CRUD endpoint.
  - Engineered `/api/user/profiles/verify` supporting real-time edge lookups for GitHub, LeetCode (GraphQL), and Codeforces.
  - Implemented `<ProfileLinkModal />` with debounced micro-spinners, live verified badges, and real avatar previews.
  - Integrated dynamic `<ConnectedProfilesCard />` on `/dashboard` with live sync indicators.
- [ ] **Milestone 2: Platform Snapshot Scrapers & Deterministic Delta Engine**
  - [x] Create MongoDB schemas (`models/PlatformStats.ts`) for LeetCode, Codeforces, GitHub, CodeChef.
  - [x] Build API fetchers (`app/lib/platform-fetchers.ts`) for each platform.
  - [x] Implement the Weekly Cron Job endpoint (`app/api/cron/fetch-stats/route.ts`) to fetch all users sequentially.
  - [x] Deterministic progress rules filter (Δ active days, Δ contest rating, Δ hard/medium solves, slacking streaks).
- [ ] **Milestone 3: AI Reviewer LLM Reasoning Engine & Superadmin Audit Hub**
  - [x] Brutally honest senior engineer persona with dynamic tone variation and open loop assignments (`services/ai/prompts.ts`).
  - [x] Multi-tier provider fallback router (Llama 3.3 70B ⇄ Gemini 2.5 Flash ⇄ GLM/Nemotron) (`services/ai/reviewerRouter.ts`).
  - [x] AI Review database persistence layer, memory state tracking, and query service (`models/AIReview.ts`, `services/ai/reviewStorage.ts`).
  - [x] Context assembler cron endpoint connecting platform snapshots + previous review memory into LLM router (`app/api/cron/generate-reviews/route.ts`).
  - [ ] User review timeline card & Pro trend graph UI on `/dashboard`.
- [ ] **Bonus Milestone: GitHub Weekly Tracking**
  - [ ] Update `models/PlatformStats.ts` for GithubStats recent events.
  - [ ] Update `app/lib/platform-fetchers.ts` to fetch `/events/public`.
- [ ] Update `services/core/dataFilter.ts` to calculate weekly/monthly contributions.
  - [ ] Update docs.

## Upcoming Marketing & Platform Tasks (Next Sprint)
- [ ] **ErithX Rebranding Email Campaign**
  - Prepare a "First Email" template for users announcing the transition from DSA Quest to ErithX.
  - Announce the new Performance Metrics feature.
  - Provide clear, step-by-step instructions on how to connect their coding profiles.
  - Include an official ErithX logo (ensure the design is extremely professional, not spam/scam).
  - Create a proper preview/mockup of this email before sending.
- [ ] **User Feedback System**
  - Build a comprehensive in-app user feedback/bug report system to gather user insights and issues.
- [ ] **SEO Polish**
  - Identify and fix any broken pages, 404s, or missing metadata hurting SEO performance.

## Modular Docs Refactor (Completed)
- [x] Extract Docs Layout (Navbar, Sidebar, Modal)
- [x] Implement `app/docs/page.tsx` (Introduction)
- [x] Implement `app/docs/performance-analysis/page.tsx`
- [x] Implement `app/docs/contest-tracker/page.tsx`
- [x] Implement `app/docs/notifications/page.tsx`

## Future Features & Polish (Backlog)
- [ ] **Social Sharing Feature**
  - Add a feature for users to share their achievements on LinkedIn, X, and other platforms.
  - Must include dynamic auto-generated images and default pre-written text.
- [ ] **Bug Report Feature**
  - Verify if `BugReport` model is fully integrated into the UI.
  - Ensure users have an accessible way to submit reports from anywhere on the platform.
- [ ] **AI Reviewer System Prompt Fix ("Balanced Generalist")**
  - Modify `services/ai/prompts.ts` so the AI stops repeating the exact phrase "you want to balance everything".
  - Ensure the AI evaluates a balanced generalist naturally without sounding repetitive or artificial.
- [ ] **Global Focus Score**
  - Develop a proprietary "Global Focus Score" metric that synthesizes multi-platform data into a single trademark metric for ErithX.
- [ ] **LLM Adaptation for New Users (Historical Data)**
  - Modify the LLM context assembler to detect brand-new users.
  - For new users, analyze their *historical data* (past months) rather than just the *current week's* data, preventing the AI from being overly harsh on their first review.
