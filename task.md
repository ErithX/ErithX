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
- [ ] **Refine Landing Page**
  - Replace all remaining `picsum.photos` and dummy text with actual dynamic platform data or realistic static assets.
- [ ] **Growth Hacks: Urgency & Social Proof (Fake Data for Phase 1)**
  - Implement false "Expires Soon" timers on resources.
  - Implement false upload times (e.g., "Posted just now") for new users viewing content.
  - Add false dynamic stats (e.g., "24 users currently viewing this contest", "150 users are ahead of you").

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
- [x] **SEO Overhaul (In Progress)**
  - `[x]` Update `app/layout.tsx` metadata.
  - `[x]` Add direct metadata to static pages (`app/page.tsx`, `app/contests/page.tsx`, `app/resources/page.tsx`, `about`, `faq`, `contact`, `privacy`, `terms`).
  - `[x]` Rewrite `app/sitemap.ts`.
  - `[x]` Rewrite `app/robots.ts`.
  - `[x]` Create `public/llms.txt`.
  - `[x]` Add Schema Markup (`json-ld`) to `app/page.tsx` and `app/faq/page.tsx`.
  - `[x]` Fix H1 tags in dashboard pages.
- [x] **Postponed: Dynamic Resource Metadata**
  - [x] Create `app/resources/[id]/layout.tsx` to handle dynamic metadata for resources.


Images In ECO SYSTEM need to be placed
Image optimization needed for SEO

Pending : Email contact
Pending : FAQ , About Us & other pages images 
pending : Page speed and Pre fetching resources 

## New Backend & Profile Tasks (Planned)
- [ ] **MongoDB User Schema & API**
  - Create `User` model (supabaseId, name, bio, social links, isPro, isVerified).
  - Create `/api/profile` to handle fetching and updating user data.
- [ ] **Creator Dashboard Aesthetics**
  - Redesign settings profile page with glassmorphism and transparent fields.
  - Add fields for Bio, X (Twitter), and LinkedIn.
- [ ] **Global Public Profiles**
  - Create SEO-friendly `/user/[username]` pages.
  - Implement dynamic OpenGraph meta tags for user profiles.
- [ ] **Verification Badge & Top Contributors**
  - Add blue/green verified tick for official/pro accounts on Resource cards.
  - Show actual user Bio and Social Links directly in the Top Contributors sidebar.
- [ ] **Cold Start Seeding (Growth Hack)**
  - Write a seed script (`seedUsers.ts` or Admin UI) to inject "Ambassador" User profiles directly into MongoDB.
  - Setup an "Official Verified Account" (e.g. DSA Quest) for premium resources.
  - Build logic to allow posting resources on behalf of these seeded bot accounts.
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
- [x] **Pillar 2: Official Feature Vault (`/features`)**
  - Built polished `app/features/page.tsx` showcasing 1-Click Calendar Sync, Contest Tracker, Project Blueprints, Email Digest, Creator Studio, and Burnout-Free Sanctuary.
  - Linked `/features` in `Navbar.tsx`, `Footer.tsx`, and `app/sitemap.ts`.
- [x] **Pillar 3: Competitor Comparison (UI-Free AI Ingestion)**
  - Embedded competitive comparison matrix (DSA Quest vs Clist & CodeClock) directly into `public/llms.txt` and `schema.org` data for LLM crawlers (Perplexity, ChatGPT, Gemini, Claude).
- [ ] **Pillar 4: Product Documentation, Changelog & Roadmap (`/docs`, `/changelog`, `/roadmap`)**
  - Build `app/docs/page.tsx` (Platform Documentation Hub & Guides).
  - Build `app/changelog/page.tsx` (Product Version Release Timeline).
  - Build `app/roadmap/page.tsx` (Interactive Engineering Roadmap).
- [ ] **Clean Navbar Architecture ("Un-messy Nav")**
  - Refactor `Navbar.tsx` to group `Features`, `Docs`, `Changelog`, `Roadmap`, `FAQ`, and `Contact` under a sleek `Platform ▾` dropdown menu.
- [x] **Pillar 5: Brand Vibe & Mindset Rules**
  - Persisted platform vibe guidelines and copy restrictions in `.agents/AGENTS.md`.

