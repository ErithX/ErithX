# DSA Quest — SEO Starter Report
*Solo-founder launch playbook · Next.js App Router + Supabase + Vercel*

---

## 0. Where you already stand

Good news from your repo: `app/sitemap.ts` and `app/robots.ts` already exist, so the file-based foundation is there. The gap is almost certainly *what's inside them* and whether every route has unique metadata — not whether the scaffolding exists. This report tells you exactly what to put in each file.

Priority order for a solo founder (do these in sequence, not all at once):
1. Technical foundation (metadata, sitemap, robots, canonical) — one-time, near-zero cost, highest leverage
2. Structured data (JSON-LD) — half a day, compounds forever
3. Directory + launch backlinks — one week, front-loaded
4. Ongoing content/link building — the part that never ends

---

## 1. URL Architecture

Rules: lowercase, hyphen-separated, no trailing slashes inconsistency, no query-string-dependent content, shallow depth (≤3 levels).

| Route | Status | Action |
|---|---|---|
| `/` | Public | Primary keyword target: "DSA contest tracker" |
| `/contests` | Public | Good — this is your organic winner per your own traffic data. Invest here. |
| `/resources` | Public | Hub page — needs category filters as crawlable links, not just JS state |
| `/resources/[id]` | **Fix this** | You're likely using a DB id/UUID as the slug (`/resources/64` or `/resources/uuid`). Switch to a human-readable slug: `/resources/os-memory-management-notes-makaut`. Slugs carry keywords; ids carry nothing. Keep the id internally, generate slug from title + a short hash for uniqueness. |
| `/about`, `/contact`, `/faq`, `/privacy`, `/terms` | Public | Fine as-is |
| `/dashboard/**` | Private | Must be **noindex + disallowed**. This is a logged-in app area, not marketing surface — never let it compete for crawl budget or leak in search results |
| `/auth/**` | Private | Disallow |
| `/api/**` | N/A | Disallow (it's JSON, not a page) |

**Domain migration (dsaquest.in):** when you cut over,
- Map every old URL → new URL 1:1 and 301 redirect (`next.config.ts` → `redirects()`, or middleware)
- Do a Google Search Console "Change of Address" once the new domain is verified
- Re-submit the new sitemap immediately
- Go back and update any backlinks/directory listings you've already earned to point at the new domain — otherwise you leave that link equity on the old one

**`api.dsaquest.in` split:** this subdomain should never appear in search results — it's a JSON API, not HTML. Nothing to optimize there, just make sure it isn't accidentally linked from crawlable pages or included in your sitemap.

---

## 2. Metadata (Next.js Metadata API)

You're on App Router, so use the file-convention pattern, not `<Head>`:

- **Root `layout.tsx`**: set defaults + a title template
  ```ts
  export const metadata: Metadata = {
    title: { default: "DSA Quest — DSA Contest Tracker & Placement Prep", template: "%s | DSA Quest" },
    description: "...",
    metadataBase: new URL("https://dsaquest.in"),
  }
  ```
- **Every static page** (`about/page.tsx`, `contests/page.tsx`, etc.): export its own `metadata` with a unique title + description. Never let two pages share a title — that's the single most common Next.js SEO mistake.
- **`/resources/[id]/page.tsx`**: use `generateMetadata({ params })` to pull the resource's real title/subject into the `<title>` and description dynamically. This is where most of your long-tail search traffic will come from (students searching exact PYQ/subject names).
- **Title formula**: `Primary Keyword — Specific Detail | DSA Quest` (50–60 chars, keyword near the front)
- **Description**: unique per page, 150–160 chars, one clear action verb, no keyword stuffing — it doesn't affect ranking directly but drives click-through rate from the SERP
- **Open Graph / Twitter cards**: set `openGraph.images` and `twitter.card = "summary_large_image"`. You already built Satori/Sharp achievement-card generation — reuse that same pipeline to auto-generate OG images per resource page instead of one static banner. Distinct social previews per page meaningfully lift share CTR.

---

## 3. Sitemap & Robots

**`app/sitemap.ts`** should be dynamic, not static:
- Loop your Supabase `resources` table (published only) and emit one entry per resource with real `lastModified`
- Include all static marketing pages
- **Exclude** `/dashboard/**`, `/auth/**`, `/api/**`
- Set sensible `changeFrequency`/`priority` (homepage + contests = daily/high; static legal pages = yearly/low)

**`app/robots.ts`**:
```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/dashboard', '/auth', '/api', '/dashboard/admin', '/dashboard/write/pending'] },
    sitemap: 'https://dsaquest.in/sitemap.xml',
  }
}
```
- **AI crawlers decision:** by default this also governs GPTBot, ClaudeBot, PerplexityBot, Google-Extended etc. Since your audience increasingly asks AI tools "best DSA contest tracker," you generally want these *allowed* on public pages (resources, contests, homepage) so you can be cited in AI answers — but that's a real tradeoff (your content becomes trainable/quotable elsewhere), so it's your call, not a default I'd force.
- Submit the sitemap to **both** Google Search Console and Bing Webmaster Tools after deploy — don't rely on passive discovery for a brand-new domain.

---

## 4. Structured Data (JSON-LD)

Add as a `<script type="application/ld+json">` via a small server component, not client-side injection:

| Page | Schema type | Why |
|---|---|---|
| Homepage | `SoftwareApplication` or `WebSite` + `Organization` | Establishes entity identity for Google's Knowledge Graph and AI answer engines |
| `/faq` | `FAQPage` | Real chance at a rich result / featured snippet |
| `/resources/[id]` | `LearningResource` or `Article` + `BreadcrumbList` | Helps Google (and AI engines) understand it's educational content, improves internal-link crawl signal |
| `/contests` | `ItemList` (of contests) | Optional, moderate value given the data changes fast |

---

## 5. Core Web Vitals / Technical Performance

- Replace raw `<img>` usage (if any — your `public/` folder has `.png`/`.jpg` company logos) with `next/image` everywhere; it auto-serves WebP/AVIF, lazy-loads, and reserves layout space (fixes CLS)
- Use `next/font` instead of external font `<link>` tags to avoid render-blocking font loads
- Keep the landing page hero content server-rendered — AI crawlers and a meaningful share of Googlebot's rendering budget don't execute heavy client JS. Anything inside a `"use client"` component that fetches data client-side is invisible to those crawlers.
- Run **PageSpeed Insights** on `/`, `/contests`, `/resources` (not just homepage) — these are your money pages
- Target thresholds at the 75th percentile: LCP < 2.5s, INP < 200ms, CLS < 0.1

---

## 6. GEO (AI Search Visibility) — worth doing now, cheap to set up

Traditional SEO ≠ how ChatGPT/Perplexity/Claude answer "best free DSA tracker for students." Both matter now:
- Create a root `llms.txt` — a short markdown file summarizing what DSA Quest is, its core features, and links to your key public pages. It doesn't replace `robots.txt`, it supplements it.
- Confirm AI crawler user-agents aren't blocked (check Vercel/Cloudflare default settings if you add either — Cloudflare in particular has started blocking AI bots by default)
- Write pages with the AI-answer pattern: **lead with the direct answer/definition in the first sentence**, then supporting detail — this is also just good UX for skimmers
- This is the same discipline as good SEO (clean structure, server-rendered, schema-tagged) — you're not building a separate strategy, you're removing friction for a second class of crawler

---

## 7. Free SEO Tool Stack (₹0 budget)

| Category | Tool | Use for |
|---|---|---|
| Indexing/health | **Google Search Console** | Non-negotiable #1. Coverage report, Core Web Vitals report, submit sitemap, spot indexing errors |
| Indexing/health | **Bing Webmaster Tools** | Same as above for Bing/Copilot search, takes 5 minutes to set up alongside GSC |
| Performance | **PageSpeed Insights** / Chrome DevTools Lighthouse | Core Web Vitals, render-blocking resources |
| Site audit | **Screaming Frog (free tier, 500 URLs)** | Your whole site fits under 500 URLs right now — run it monthly to catch broken links, duplicate titles/descriptions, missing metadata |
| Schema testing | **Google Rich Results Test** | Validate your JSON-LD before shipping |
| Keyword research | **Google Keyword Planner** (free via an Ads account, no ad spend needed) | Search volume for "DSA contest tracker," "MAKAUT PYQ," etc. |
| Keyword research | **Google Trends** | Seasonal patterns (placement season spikes, exam season spikes) |
| Keyword research | **AnswerThePublic (limited free)** / **Ubersuggest (limited free)** | Question-phrase and long-tail ideas |
| Backlinks | **Ahrefs Webmaster Tools (free, requires verified site)** | Your own backlink profile, broken backlinks, on-page audit — genuinely full-featured for a verified site owner |
| Analytics | **Google Analytics 4** | Behavior after landing — pairs with GSC's "who found you," GA4 tells you "what they did" |
| Browser extension | **MozBar** | Quick DR/DA spot-checks while researching directories/guest post targets |

Set-up order in week 1: GSC → Bing Webmaster → GA4 → submit sitemap to both → Screaming Frog crawl to catch what you missed.

---

## 8. Backlinks — should you pursue them, and how

**Yes.** Backlinks remain a core ranking signal, and increasingly also influence whether AI answer engines cite you. But *not* volume — relevance and order matter far more for a brand-new site than for an established one. Never buy links or join link-exchange schemes; both risk a manual action penalty and add nothing to a brand-new domain that needs to build trust, not shortcuts.

**Phase 1 — Launch week (free, dofollow where possible):**
- Product Hunt launch (plan the day, don't launch on a whim — Tue–Thu performs best)
- BetaList / StartupBase / Uneed — free listings, some dofollow
- Indie Hackers post (build-in-public story) + Hacker News "Show HN"
- Dev.to and Hashnode article: "Why I built a DSA contest tracker as a student" — genuinely useful narrative content, not just an announcement
- GitHub: pin the repo (if public parts exist), use topics/tags so it surfaces in GitHub search
- Reddit: r/developersIndia, r/csMajors (participate genuinely first, don't drop-and-run — mods remove those)
- LinkedIn post tagging your college/department if appropriate

**Phase 2 — Month 1–3:**
- Submit to niche directories that are still dofollow in 2026: Launching Next, SaaSHub, AlternativeTo, Turbo0
- Write one high-quality guest post on a dev-focused blog relevant to students (audience overlap matters more than the site's raw authority — one relevant guest post beats ten generic ones)
- Build a comparison/positioning page on your own site ("DSA Quest vs. manually tracking Codeforces + LeetCode + GitHub") — these rank well for long-tail comparison searches and *attract* links from "best tools for X" roundups
- Reach out to college tech societies/CS department pages across India for a resource-page mention (genuinely relevant, high-trust link source for an ECE/CS student tool)

**Phase 3 — Month 3–6, compounding assets:**
- Turn your existing MAKAUT PYQ trend-analysis work into a public, shareable "linkable asset" — e.g., a free interactive PYQ trend/weightage tool for a few popular subjects. This is the kind of thing student forums and blogs link to *without you asking*, because it's genuinely useful and self-contained.
- Broken-link building: find "best DSA/placement prep resources" roundup posts with dead links to old tools, offer DSA Quest as the replacement
- Keep publishing the semester-prep content you already do well (PYQ breakdowns, question banks) as public blog posts — each one is a new indexable page and a new reason for someone to link to you

**What not to do:** don't pay for bulk link packages, don't do reciprocal link exchanges at scale, don't stuff anchor text with your exact keyword every time (vary it — brand name, URL, natural phrase). A handful of genuinely relevant links from student/dev communities will outperform fifty generic directory drops.

---

## 9. 30-Day Checklist

- [ ] Fix `/resources/[id]` → slug-based URLs
- [ ] Unique `metadata` on every static page + `generateMetadata` on resource pages
- [ ] Dynamic `sitemap.ts` pulling from Supabase, excluding private routes
- [ ] `robots.ts` disallowing `/dashboard`, `/auth`, `/api`
- [ ] JSON-LD: `Organization`/`SoftwareApplication` on home, `FAQPage` on `/faq`
- [ ] Set up GSC + Bing Webmaster Tools, verify, submit sitemap
- [ ] Set up GA4
- [ ] Run one Screaming Frog crawl, fix what it flags
- [ ] Add `llms.txt`
- [ ] Ship OG images per resource page (reuse your Satori pipeline)
- [ ] Product Hunt + BetaList + Indie Hackers launch stack
- [ ] One dev.to/Hashnode build-in-public article