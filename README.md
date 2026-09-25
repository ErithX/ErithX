# ErithX — Contest Calendar + Placement Prep Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Stars](https://img.shields.io/github/stars/ErithX/ErithX)](https://github.com/ErithX/ErithX/stargazers)
[![Forks](https://img.shields.io/github/forks/ErithX/ErithX)](https://github.com/ErithX/ErithX/network/members)
[![Issues](https://img.shields.io/github/issues/ErithX/ErithX)](https://github.com/ErithX/ErithX/issues)
[![Last Commit](https://img.shields.io/github/last-commit/ErithX/ErithX)](https://github.com/ErithX/ErithX/commits/main)
[![Live](https://img.shields.io/badge/Live-erithx.dev-0A66C2?logo=vercel&logoColor=white)](https://erithx.dev)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

> Stop juggling multiple coding platforms. Track contests, monitor consistency, and turn your competitive programming and dev activity into a weekly growth plan.

Live app: https://erithx.dev  
Docs: https://erithx.dev/docs  
Features: https://erithx.dev/features

---

## Product overview

ErithX is a smart engineering growth platform built for students and developers who take competitive programming and placements seriously.

It connects the signals that matter most across your coding journey:

- contest participation across Codeforces, LeetCode, CodeChef, AtCoder, HackerRank, and more
- coding profile activity from GitHub, LeetCode, and Codeforces
- weekly AI-powered review of performance, consistency, and weak areas
- placement-focused learning resources, notes, and curated engineering resources
- email alerts and calendar sync to keep you on track without missing important rounds

The platform is designed to help users move from “random practice” to a structured growth system with measurable momentum.

---

## Product flow

ErithX follows a simple loop:

1. Connect profiles
   - Link your LeetCode, Codeforces, and GitHub profiles
   - Confirm your coding identities and activity sources
2. Track contests and momentum
   - See upcoming and live contests in one place
   - Add them to Google Calendar or Apple Calendar with one click
   - Get reminders before competitions start
3. Review performance weekly
   - Receive honest AI-generated feedback
   - Understand strengths, weak areas, and streak consistency
   - Get a 7-day action plan tailored to your current progress
4. Learn and improve
   - Discover curated engineering notes, blogs, PDFs, and resources
   - Publish and share useful resources with the community

---

## Platform preview

### Product demo

A short product preview is included in the repository and can be used for marketing and GitHub presentation.

[Open product demo video](./Assets/Product%20GIF.mp4)

### Screenshot gallery

![Sign up](./Assets/SIgn%20up.png)

Onboarding — clean sign-in flow with role-based onboarding and Google OAuth.

![Coding profiles](./Assets/Coding%20profiles.png)

Profile Connections — connect LeetCode, GitHub, and Codeforces for verification and personalization.

![Dashboard](./Assets/Dashboard.png)

User Dashboard — track growth, percentile ranking, focus score, next contests, and AI critique.

![Contests](./Assets/Contests.png)

Contests Dashboard — see live and upcoming rounds with countdowns, platform links, and alerts.

![Email alert + calender](./Assets/Email%20alert%20%2B%20calender.png)

Sync & Alerts — one-click calendar sync and email notifications for upcoming contests.

![Customization](./Assets/Customization.png)

AI Mentor Settings — customize the reviewer to match your target path, whether FAANG, startup, CP, or custom.

![Report](./Assets/Report.png)

AI Weekly Review — candid weekly report with performance trends, percentile, and actionable feedback.

![Articles](./Assets/Articles.png)

Resource Vault — engineering resource hub featuring shared resource statistics, filters, article previews, and weekly review CTA.

![Write](./Assets/Write.png)

Resource Editor — rich text publishing flow for submitting notes, articles, and study material.

---

## Why ErithX matters

ErithX is built for the reality of competitive programming and placement prep:

- students are juggling multiple platforms
- contest schedules are fragmented across services
- performance feedback is inconsistent or absent
- preparation is harder without a long-term system

The platform brings those workflows into one place so progress becomes easier to track and act on.

---

## Key features

### Contest synchronization

- aggregate contests from multiple platforms
- local timezone conversion
- Google Calendar / Apple Calendar support
- upcoming and live contest tracking

### Weekly AI review

- connect public coding profiles
- review consistency, strength, and weak spots
- generate 7-day improvement plans
- make performance analysis actionable, not generic

### Resource vault

- curated engineering resources and study material
- notes, PDFs, blogs, and career-focused content
- share-ready publishing workflow for contributors

### Smart alerts

- contest reminders
- weekly digest summaries
- user-specific performance nudges

---

## Technology stack

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

- Frontend: Next.js 16 + TypeScript + Tailwind CSS
- Backend: Supabase
- Deployment: Vercel
- Integrations: LeetCode, Codeforces, CodeChef, AtCoder, HackerRank, GeeksforGeeks, GitHub
- Alerts: automated email and reminder flow

---

## Quick start

### For users

1. Visit https://erithx.dev
2. Sign in with Google
3. Connect your competitive programming and developer profiles
4. Review upcoming contests and your weekly growth report
5. Use calendar sync and notifications to stay consistent

### For developers

```bash
# Clone the repository
git clone https://github.com/ErithX/ErithX.git
cd ErithX

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start the app
npm run dev
```

Then open http://localhost:3000

Requirements:

- Node.js 18+
- Supabase account
- Google OAuth setup
- Email service credentials

---

## Documentation

- [Docs Hub](https://erithx.dev/docs)
- [Performance Analysis](https://erithx.dev/docs/performance-analysis)
- [Contest Tracker Guide](https://erithx.dev/docs/contest-tracker)
- [Creator Studio](https://erithx.dev/docs/creator-studio)
- [Notifications](https://erithx.dev/docs/notifications)
- [FAQ](https://erithx.dev/faq)

---

## Security and privacy

- Public profile data only
- No password storage for platform-linked account access
- OAuth-based authentication
- Responsible disclosure process available via SECURITY.md

---

## Contributing

We welcome community contributions across bug reports, features, UI refinements, and documentation.

To contribute:

1. Fork the repository
2. Create a feature branch
3. Make a focused change
4. Run lint and validation checks
5. Open a PR with a clear summary

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full contributor guide.

---

## Support

- [Contact Us](https://erithx.dev/contact)
- [GitHub Issues](https://github.com/ErithX/ErithX/issues)
- [Security Policy](./SECURITY.md)

---

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).

---

Made for engineering students, competitive programmers, and builders who want better structure and better growth.
