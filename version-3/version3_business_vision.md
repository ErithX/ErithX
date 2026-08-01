# Version 3: Business & Product Vision

## Core Philosophy
- **Product Dev Mode:** We are building this from a product and business perspective first, not just engineering. Our primary goal is to provide **real career guidance** without overwhelming students with a "complex" dashboard. The focus is on clarity, actionable growth, and a premium experience.
- **Free vs. Paid Tiers:** Everything we build (emails, AI analysis, analytics, and cards) must seamlessly support the subscription model. Free users get standard insights based on recent (e.g. weekly) deltas. Paid users get deep historic analysis, comprehensive trend graphs, and personalized career roadmaps.

## System Architecture Overview
1. **Data Ingestion:** Fetch raw data from verified URLs (GitHub, Codeforces, LeetCode) efficiently via scheduled light calls.
2. **Delta & Rule Engine:** Instead of storing bloated overall stats, store timestamped snapshots. Filter this data through strict progress rules to capture *real* growth.
3. **Card Generator (Future):** Down the line, the metric engine will feed into a Card Generator (5 types, 6 variations = 30 cards) to gamify and visualize growth on the UI.
4. **AI / LLM Layer:** The LLM acts as a brutally honest, senior engineer reviewer. The output MUST NOT follow a rigid, repetitive structure every week. It should read entirely like a human-written email—if a user was inactive, it simply states they were inactive rather than printing empty tables. It provides dynamic, unfiltered feedback (fair reviews, brutal downgrades, or celebration of real milestones) exactly as a human mentor would.
5. **Delivery:** The AI response is delivered via an intelligent email system (aware of Free vs. Paid depth) and stored in the database.

## Observability & Quality Control
- **Superadmin View:** Every generated AI response must be stored in the database so that admins can review the quality of the feedback and ensure the AI remains unfiltered and accurate.

## Future Roadmap
- **Analytics Dashboard:** Free users get basic analytics; Paid users get premium, complex analytics.
- **Smart Recommendations:** The AI will automatically suggest tailored resources and problem sets.
- **1:1 Professional Conferences:** Eventually, the system will integrate 1:1 mentoring sessions with real professionals based on the user's progress.
