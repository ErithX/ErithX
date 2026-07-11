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
