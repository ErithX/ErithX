import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  CalendarPlus, Swords, BookOpen, Bell, Sparkles, ShieldCheck, 
  CheckCircle2, ArrowRight, Zap, Terminal, FileText, 
  Globe, ExternalLink, ArrowUpRight, Code2, Mail
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Platform Documentation & Architecture Guide | DSA Quest',
  description: 'Official technical documentation for DSA Quest. Learn how our 1-click Google Calendar sync operates, explore multi-platform contest aggregation architecture, and master our project blueprints designed for 2026 tech hiring.',
  keywords: [
    'DSA Quest documentation', 
    'google calendar sync API', 
    'coding contest aggregator', 
    'system design blueprints', 
    'competitive programming guide', 
    'software engineering placement prep',
    'tech interview preparation 2026'
  ],
  authors: [{ name: 'DSA Quest Engineering' }],
  openGraph: {
    title: 'Platform Documentation & Architecture Guide | DSA Quest',
    description: 'Deep dive into DSA Quest\'s architecture: 1-click calendar sync, multi-platform contest aggregation, and advanced project blueprints.',
    url: 'https://contest-tracker-zms3.vercel.app/docs',
    siteName: 'DSA Quest',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Platform Documentation | DSA Quest',
    description: 'Deep dive into DSA Quest\'s architecture: 1-click calendar sync, multi-platform contest aggregation, and advanced project blueprints.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://contest-tracker-zms3.vercel.app/docs',
  },
};

export default function DocsPage() {
  const faqUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/faq`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'DSA Quest Official Platform Documentation',
    alternativeHeadline: 'Architecture Guide and User Manual',
    url: 'https://contest-tracker-zms3.vercel.app/docs',
    description: 'Comprehensive technical documentation and user guide for DSA Quest features, calendar sync mechanics, project blueprints, and platform philosophy.',
    author: {
      '@type': 'Organization',
      name: 'DSA Quest',
      url: 'https://contest-tracker-zms3.vercel.app'
    },
    publisher: {
      '@type': 'Organization',
      name: 'DSA Quest',
      logo: {
        '@type': 'ImageObject',
        url: 'https://contest-tracker-zms3.vercel.app/logo.png'
      }
    }
  };

  const docSections = [
    { id: 'getting-started', label: '1. Ecosystem Overview' },
    { id: 'calendar-sync', label: '2. Calendar Synchronization' },
    { id: 'contest-aggregator', label: '3. Aggregator Architecture' },
    { id: 'project-blueprints', label: '4. Project Blueprints' },
    { id: 'creator-studio', label: '5. Creator Studio' },
    { id: 'email-digest', label: '6. Notification Engine' },
    { id: 'digital-sanctuary', label: '7. Engineering Philosophy' },
  ];

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-300 selection:bg-emerald-500/30 selection:text-white flex flex-col font-sans antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="relative flex-1 overflow-hidden">
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)', filter: 'blur(100px)' }}></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.4] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-24 md:py-32">
          
          {/* Header */}
          <header className="mb-20 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-sm mb-8">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-400">Technical Documentation</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-6 leading-[1.1]">
              Architecture Guide & <br className="hidden sm:block"/>User Manual
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Welcome to the official DSA Quest documentation. This guide details the underlying architecture of our platform, from real-time multi-platform contest aggregation and 1-click calendar synchronization to our philosophy of sustainable, burnout-free engineering preparation.
            </p>
          </header>

          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-16 items-start">
            
            {/* Sidebar Sticky Navigation */}
            <aside className="lg:sticky lg:top-24 hidden lg:block">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-white">On this page</span>
                </div>
                
                <nav className="flex flex-col gap-1">
                  {docSections.map((section) => (
                    <a 
                      key={section.id} 
                      href={`#${section.id}`} 
                      className="px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-zinc-500 hover:text-white transition-all flex items-center justify-between group"
                    >
                      <span>{section.label}</span>
                      <ArrowRight className="w-3 h-3 text-zinc-700 group-hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100" />
                    </a>
                  ))}
                  <a 
                    href="#faq-navigation" 
                    className="px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-zinc-500 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <span>8. FAQ & Support</span>
                    <ArrowRight className="w-3 h-3 text-zinc-700 group-hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100" />
                  </a>
                </nav>

                <div className="mt-6 pt-6 border-t border-white/5">
                  <Link href="/features" className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-all">
                    <Sparkles className="w-3.5 h-3.5" />
                    Explore Visual Features
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main Docs Content Stream */}
            <div className="space-y-20 max-w-3xl">

              {/* 1. Getting Started */}
              <section id="getting-started" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    Ecosystem Overview
                  </h2>
                </div>
                <div className="space-y-5 text-[15px] text-zinc-400 leading-relaxed">
                  <p>
                    DSA Quest is engineered as a high-fidelity, student-first digital sanctuary aimed at democratizing software engineering placement preparation. We replaced the chaotic, fragmented experience of shuffling between a dozen competitive programming platforms with a unified, distraction-reduced command center.
                  </p>
                  <p>
                    Our architecture is designed around three core pillars: real-time data aggregation, frictionless utility, and mental wellness. By bridging the gap between raw algorithmic practice and modern system design, we prepare developers not just for legacy interviews, but for the rigorous demands of 2026+ tech hiring.
                  </p>
                  <div className="mt-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">Core Objectives</h4>
                    <ul className="space-y-3 text-sm text-zinc-400">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong className="text-zinc-200">Unified Match Scheduling:</strong> Programmatically track and surface live and upcoming competitive programming contests across LeetCode, Codeforces, CodeChef, AtCoder, and more, ensuring zero missed opportunities.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong className="text-zinc-200">2026+ Career Readiness:</strong> Move beyond trivial DSA memorization. We emphasize real-world system architecture, RAG AI pipelines, vector databases, and offer downloadable PDF project blueprints.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong className="text-zinc-200">Sanctuary Philosophy:</strong> Eliminate artificial streak pressures and ad noise. We foster an environment where developers build sustainable craftsmanship and maintain mental clarity.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 2. 1-Click Calendar Sync */}
              <section id="calendar-sync" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CalendarPlus className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    1-Click Calendar Synchronization
                  </h2>
                </div>
                <div className="space-y-5 text-[15px] text-zinc-400 leading-relaxed">
                  <p>
                    Our proprietary synchronization engine allows developers to port upcoming coding contests directly to their personal Google Calendar or Apple iCal with a single click. This bypasses the need for brittle browser extensions or manual entry.
                  </p>

                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-5">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">Technical Implementation</h4>
                    
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-emerald-400 font-semibold flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4" /> Timezone Auto-Conversion
                        </span>
                        <p className="text-zinc-400 leading-relaxed">
                          Contest start timestamps are strictly encoded in ISO 8601 UTC format. The calendar event payloads leverage native timezone translation, ensuring the match schedule renders accurately in the user's exact local timezone.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-cyan-400 font-semibold flex items-center gap-2 mb-2">
                          <ExternalLink className="w-4 h-4" /> Event Metadata Linking
                        </span>
                        <p className="text-zinc-400 leading-relaxed">
                          Generated calendar events are injected with rich metadata: official contest titles, platform origin tags, and direct participation URLs embedded within the event description field.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/20 text-sm">
                      <span className="text-emerald-400 font-semibold block mb-1">Extension-Less Architecture</span>
                      <p className="text-zinc-400">
                        Unlike plugins that require background permissions and drain system resources, DSA Quest generates standard web calendar templates. This ensures instantaneous compatibility across mobile iOS Safari, Android Chrome, and desktop environments.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Multi-Platform Aggregator */}
              <section id="contest-aggregator" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Swords className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    Multi-Platform Aggregator Architecture
                  </h2>
                </div>
                <div className="space-y-5 text-[15px] text-zinc-400 leading-relaxed">
                  <p>
                    The aggregator serves as the central nervous system of DSA Quest. Our distributed backend scrapers continuously poll and normalize match data from over 10 major platforms, including LeetCode, Codeforces, CodeChef, AtCoder, HackerRank, GeeksforGeeks, and Kaggle.
                  </p>
                  
                  <div className="grid sm:grid-cols-3 gap-4 my-6">
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="text-red-400 font-bold mb-2 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span> Live Now
                      </div>
                      <p className="text-sm text-zinc-400">Active ongoing matches surfaced with real-time countdown timers tracking down to the exact second of match termination.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="text-emerald-400 font-bold mb-2 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Today
                      </div>
                      <p className="text-sm text-zinc-400">Curated lists of upcoming matches scheduled to begin within the next 24 hours, filtered by user preference.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="text-cyan-400 font-bold mb-2 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Upcoming
                      </div>
                      <p className="text-sm text-zinc-400">A 30-day forward-looking radar of all major competitive programming events across the ecosystem.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Project Blueprints */}
              <section id="project-blueprints" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    Project Blueprints & PDF Vault
                  </h2>
                </div>
                <div className="space-y-5 text-[15px] text-zinc-400 leading-relaxed">
                  <p>
                    Transitioning from theoretical data structures to practical system design is a notorious bottleneck for students. DSA Quest bridges this gap by curating high-yield engineering blueprints tailored for modern technical interviews. Rather than superficial tutorials, these resources provide deep architectural diagrams, microservice schemas, and downloadable PDF references.
                  </p>
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">Featured Blueprint Topics</h4>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300">Vector DBs & RAG AI Pipelines</span>
                      <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300">Distributed Microservices Design</span>
                      <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300">Real-Time Event Streaming</span>
                      <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300">2026 Tech Hiring Playbooks</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. Creator Studio */}
              <section id="creator-studio" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    Creator Studio & Peer Publishing
                  </h2>
                </div>
                <div className="space-y-5 text-[15px] text-zinc-400 leading-relaxed">
                  <p>
                    The Creator Studio empowers senior software engineers and verified contributors to give back to the community by publishing technical articles, deep dives, and study notes directly through our platform.
                  </p>
                  <ul className="space-y-3 list-disc list-inside text-zinc-400 text-[15px] marker:text-emerald-400">
                    <li>Powered by Tiptap, offering rich markdown support and native code syntax highlighting.</li>
                    <li>Automatic draft saving mechanics with a streamlined submission pipeline for admin review.</li>
                    <li>Granular impression-based analytics tracking views, read-through rates, and upvotes.</li>
                    <li>Verified author checkmark badges to ensure high-signal, high-trust content moderation.</li>
                  </ul>
                </div>
              </section>

              {/* 6. Email Reminders & Digest */}
              <section id="email-digest" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    Notification Engine & Digest System
                  </h2>
                </div>
                <div className="space-y-5 text-[15px] text-zinc-400 leading-relaxed">
                  <p>
                    Our notification infrastructure delivers automated, high-fidelity contest reminder alerts and weekly engineering digests. This is orchestrated through Resend API integrations coupled with secure cron triggers to ensure timely delivery.
                  </p>
                  <p>
                    Users possess full autonomy over their notification preferences. Toggles for <code className="px-1.5 py-0.5 rounded bg-white/10 text-emerald-400 text-xs">contest_alerts</code>, <code className="px-1.5 py-0.5 rounded bg-white/10 text-emerald-400 text-xs">weekly_digest</code>, and <code className="px-1.5 py-0.5 rounded bg-white/10 text-emerald-400 text-xs">product_updates</code> can be dynamically adjusted at any time via the profile settings dashboard.
                  </p>
                </div>
              </section>

              {/* 7. Burnout-Free Sanctuary */}
              <section id="digital-sanctuary" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    Engineering Philosophy: Burnout-Free Sanctuary
                  </h2>
                </div>
                <div className="space-y-5 text-[15px] text-zinc-400 leading-relaxed">
                  <p>
                    We fundamentally reject the gamified, toxic placement panic and artificial streak pressures propagated by legacy platforms. DSA Quest is intentionally engineered to foster consistent, passionate craftsmanship. By removing distracting ad clutter and meaningless metrics, we help developers build sustainable, long-term careers with their mental sanity fully intact. Preparation should be a journey of intellectual growth, not an anxiety-inducing sprint.
                  </p>
                </div>
              </section>

              {/* 8. FAQ CTA Navigation */}
              <section id="faq-navigation" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    FAQ & Support
                  </h2>
                </div>
                <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Looking for Frequently Asked Questions?</h3>
                    <p className="text-sm text-zinc-400 max-w-xl">
                      We have compiled a comprehensive list of common queries, platform troubleshooting steps, and technical support answers in our dedicated FAQ hub.
                    </p>
                  </div>
                  <a 
                    href={faqUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="shrink-0 px-5 py-3 rounded-xl bg-emerald-500 text-zinc-950 text-sm font-bold flex items-center gap-2 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Visit FAQ Hub
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </section>

            </div>

          </div>

          {/* Bottom Footer Callout */}
          <div className="mt-24 pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-3xl lg:max-w-none">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Ready to explore capabilities?</h3>
              <p className="text-sm text-zinc-400">Check out our visual features overview or jump straight into the live contest arena.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/features" className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition-all">
                Visual Features
              </Link>
              <Link href="/contests" className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 text-sm font-bold hover:bg-zinc-200 transition-all">
                Live Contests
              </Link>
            </div>
          </div>

        </div>
      </main>

    
    </div>
  );
}