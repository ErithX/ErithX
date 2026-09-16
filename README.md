# ErithX â€” Unified Coding Contest Calendar & Placement Prep Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE) [![Stars](https://img.shields.io/github/stars/ErithX/ErithX)](https://github.com/ErithX/ErithX/stargazers) [![Forks](https://img.shields.io/github/forks/ErithX/ErithX)](https://github.com/ErithX/ErithX/network/members) [![Issues](https://img.shields.io/github/issues/ErithX/ErithX)](https://github.com/ErithX/ErithX/issues)

> **Stop juggling 10+ contest sites. Track everything in one place. Get smarter about placement prep.**

ðŸ”— **[Live Platform](https://erithx.dev)** â€¢ ðŸ“Š **[Performance Analysis](https://erithx.dev/docs/performance-analysis)** â€¢ ðŸ† **[Live Contest Calendar](https://erithx.dev/contests)** â€¢ [...]

---

## TL;DR
Unified contest calendar + weekly AI-powered performance reviews â€” MIT licensed. Live demo: https://erithx.dev

---

## ðŸŽ¯ What is ErithX?

ErithX is an engineering platform built for Indian students and developers who take competitive programming seriously. It combines:

1. **Live Coding Contest Calendar** â€” Real-time tracking of 10+ platforms (LeetCode, Codeforces, CodeChef, AtCoder, HackerRank, GeeksforGeeks, etc.) with automatic **1-click Google Calendar & iCal** exports
2. **Weekly Performance Review** â€” AI-powered analysis of your LeetCode, Codeforces, and GitHub activity every Sunday
3. **Placement Prep Resources** â€” Curated system design, backend architecture, and project blueprint PDFs
4. **Smart Email Alerts** â€” Never miss a contest round again

Used by **2,400+ engineering students** across India. **Free to start, no credit card required.**

---

## Preview

![App screenshot](./assets/screenshot.png)

Add a screenshot or GIF at `assets/screenshot.png` to replace the placeholder above. A good preview helps reviewers and contributors evaluate the product quickly.

---

## âœ¨ Key Features

### ðŸ—“ï¸ Contest Synchronization
- Aggregates contests from **10+ competitive programming platforms**
- Automatic timezone conversion based on your location
- 1-click export to **Google Calendar or Apple iCal**
- Real-time contest status tracking (upcoming, live, concluded)

### ðŸ“Š Automated Weekly Reviews
- Connects to **LeetCode, Codeforces, and GitHub** public profiles (no password needed)
- Analyzes your weekly problem difficulty distribution
- Tracks contest attendance and rating trajectory
- Generates actionable 7-day improvement targets
- **Every Sunday at 9:00 PM**: Honest performance verdict + next week's focus areas

### ðŸ“š Engineering Resource Vault
- Professionally curated articles on **system design, backend architecture, database patterns, and full-stack project blueprints**
- Downloadable **PDFs** for offline study
- Organized by difficulty and topic
- Contributor-driven (add your best resources)

### ðŸ“§ Smart Notifications
- Configurable contest reminders (sent before contest starts)
- Placement season alerts and industry hiring signals
- Weekly digest of trending problems and solutions

---

## ðŸš€ Quick Start

### For Users
1. Visit [erithx.dev](https://erithx.dev)
2. Sign in with Google (no password required)
3. Connect your **LeetCode**, **Codeforces**, and **GitHub** profiles
4. Click "Add to Calendar" on any contest to sync instantly
5. Receive your first performance review **next Sunday**

### For Developers (Local Setup)

```bash
# Clone the repository
git clone https://github.com/ErithX/ErithX.git
cd contest-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase, Google OAuth, and email service credentials

# Run development server
npm run dev

# Open http://localhost:3000
```

**Prerequisites:**
- Node.js 18+
- Supabase account (free tier works)
- Google OAuth credentials
- Email service (SendGrid, Resend, or similar)

---

## ðŸ—ï¸ Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Vercel
- **APIs Integrated**: LeetCode, Codeforces, CodeChef, AtCoder, HackerRank, GeeksforGeeks, GitHub
- **Email**: Automated weekly digests via Cron jobs
- **Analytics**: Google Analytics 4 (privacy-respecting)

---

## ðŸ“– Documentation

- **[Performance Analysis Guide](https://erithx.dev/docs/performance-analysis)** â€” Understand how weekly reviews are calculated
- **[Platform Features](https://erithx.dev/features)** â€” Full feature walkthrough
- **[FAQ](https://erithx.dev/faq)** â€” Common questions about supported platforms, data privacy, and calendar sync
- **[About Us](https://erithx.dev/about)** â€” Mission and team background

---

## ðŸ”’ Privacy & Security

- âœ… **No password storage** â€” OAuth only (Google, GitHub)
- âœ… **Public profiles only** â€” We never access private repositories or contest solutions
- âœ… **Your data stays yours** â€” Full account deletion available anytime
- âœ… **Zero tracking cookies** â€” Analytics for product improvement, never for advertising
- ðŸ“„ **[Privacy Policy](https://erithx.dev/privacy)**

> Note for contributors: use `.env.example` as a template for required environment variables. Never commit secrets â€” see SECURITY.md for more details.

---

## ðŸ¤ Contributing

We welcome contributions from the community! Whether it's:
- ðŸ“ Adding new study resources
- ðŸ› Reporting bugs
- âœ¨ Suggesting features
- ðŸŒ Improving platform for other regions

**To contribute:**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "feat: add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

**Important:** Before touching the system prompt or AI reviewer logic, open an issue first. These are core to the platform's value.

---

## ðŸ“Š Performance & Analytics

The platform tracks:
- Contest participation trends across your cohort
- Problem-solving velocity (easy/medium/hard distribution)
- Placement season hiring signals (aggregated, anonymized)

**We do NOT track:**
- Specific problem solutions or your contest codes
- Personal information beyond what you provide
- Behavior for ad targeting

---

## ðŸŽ“ Who is ErithX for?

- **Engineering students** prepping for placements (all years)
- **Competitive programmers** wanting to optimize their practice routine
- **Job seekers** tracking hiring season timelines
- **College tech clubs** coordinating contest participation
- **Tech educators** tracking student progress

---

## ðŸ†˜ Support

- **[Contact Us](https://erithx.dev/contact)** â€” Email support for account issues
- **[GitHub Issues](https://github.com/ErithX/ErithX/issues)** â€” Report bugs and feature requests
- **[Discussions](https://github.com/ErithX/ErithX/discussions)** â€” Ask questions, share feedback

---

## ðŸ“œ License

This project is licensed under the **MIT License** â€” see the [LICENSE](./LICENSE) file for details.

---

## ðŸŒŸ Acknowledgments

- Built by engineers, for engineers
- Inspired by the placement prep struggles of 2,400+ students
- Powered by amazing open-source communities (Next.js, Tailwind, Supabase, etc.)

---

**Made with â¤ï¸ for the engineering community in India**

Last updated: September 2026 | [Star on GitHub](https://github.com/ErithX/ErithX) â­
