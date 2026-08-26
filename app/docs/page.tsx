import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Activity, CalendarPlus, Swords, Code2, ArrowRight, 
  ArrowUpRight, Target, ShieldAlert, Sparkles, Mail, CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Platform Documentation & User Guide | ErithX',
  description: 'Learn how ErithX tracks your coding progress, analyzes your weekly performance, and curates high-quality contests to keep you accountable.',
  // ... keep your existing keywords/openGraph but update descriptions
};

export default function DocsPage() {
  const faqUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/faq`;

  const docSections = [
    { id: 'performance-analysis', label: '1. ErithX Performance Analysis' },
    { id: 'contest-tracker', label: '2. Contest Tracker & Sync' },
    { id: 'creator-studio', label: '3. Creator Studio & Guidelines' },
    { id: 'notifications', label: '4. Notifications & Alerts' },
  ];

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-300 selection:bg-emerald-500/30 selection:text-white flex flex-col font-sans antialiased">
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
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-400">User Documentation</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-6 leading-[1.1]">
              The ErithX <br className="hidden sm:block"/>User Manual
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              ErithX is not a vanity metrics platform. It is an internal system-driven mentorship experience designed to keep you accountable. This guide explains how our performance analysis works, how to track contests, and how to make the most of the platform.
            </p>
          </header>

          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-16 items-start">
            
            {/* Sidebar Sticky Navigation */}
            <aside className="lg:sticky lg:top-24 hidden lg:block">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/5">
                  <Target className="w-4 h-4 text-emerald-400" />
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
                </nav>
              </div>
            </aside>

            {/* Main Docs Content Stream */}
            <div className="space-y-20 max-w-3xl">

              {/* 1. ErithX Performance Analysis */}
              <section id="performance-analysis" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    ErithX Performance Analysis
                  </h2>
                </div>
                
                <div className="space-y-6 text-[15px] text-zinc-400 leading-relaxed">
                  
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <h3 className="text-lg font-medium text-zinc-100 mb-3">Beyond Vanity Metrics</h3>
                    <p>
                      We do not care if you have solved 500 problems or have a 2000+ rating. Traditional platforms reward you for volume, but ErithX rewards you for <span className="text-white font-medium">actual progression</span>. 
                    </p>
                    <p className="mt-3">
                      When you connect your profiles (LeetCode, Codeforces, GitHub), our system synthesizes your real activity. It looks at your consistency, the difficulty of problems you attempt, and whether you are spending time in your comfort zone just to pad your numbers. It compares your current activity against previous weeks to identify real trends.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-zinc-100 mb-3">How It Evaluates You</h3>
                    <p className="mb-4">Every week, the internal system carefully analyzes:</p>
                    <ul className="space-y-3 text-zinc-400">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong className="text-zinc-200">Target Alignment:</strong> Are your projects and problem choices aligned with your stated goals (Top Tier/FAANG, Startup level, or Balanced)?</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong className="text-zinc-200">Engineering Quality:</strong> Are your GitHub projects just tutorial follow-alongs, or do they demonstrate real engineering?</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong className="text-zinc-200">Comfort Zone Traps:</strong> Are you repeatedly solving easy problems to maintain streaks instead of pushing into Medium/Hard DP or Trees?</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-zinc-100 mb-3">Honest, Strict Mentorship</h3>
                    <p>
                      ErithX is not an AI that encourages everything you do, even your mistakes. Our system tones vary based on your performance. If you repeatedly ignore mentor advice and targets, the system tone becomes stricter.
                    </p>
                    <div className="mt-4 p-4 rounded-xl bg-red-500/[0.03] border border-red-500/20 flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-red-400 font-semibold block mb-1">Accountability System</span>
                        <p className="text-sm text-zinc-400">
                          Continued inactivity or repeated ignorance of targets will lead to stricter warnings and eventual termination of your mentorship access. This is not designed as a punishment, but to ensure you take your preparation seriously.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-zinc-100 mb-3">Getting Started</h3>
                    <p>To activate your weekly analysis, you must connect at least two active profiles (e.g., LeetCode and GitHub) from your Dashboard Settings. Once connected, the system establishes your baseline and begins tracking your weekly cycle.</p>
                  </div>

                </div>
              </section>

              {/* 2. Contest Tracker */}
              <section id="contest-tracker" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Swords className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    Contest Tracker & Sync
                  </h2>
                </div>
                <div className="space-y-6 text-[15px] text-zinc-400 leading-relaxed">
                  <p>
                    We track and arrange competitive programming contests from high-quality, relevant platforms. We do not just list 100+ contests; we surface the ones that actually matter for your growth.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-2 mb-2 text-zinc-200">
                        <CalendarPlus className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-medium">1-Click Calendar Sync</span>
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Add contests directly to your Google or Apple Calendar without needing a browser extension. Timezones are automatically converted to your local time.
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-2 mb-2 text-zinc-200">
                        <Mail className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium">Email Alerts</span>
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Sign up with one click to receive performance analysis and email alerts before your favorite contests begin. Never miss a match.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Creator Studio & Guidelines */}
              <section id="creator-studio" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    Creator Studio & Guidelines
                  </h2>
                </div>
                <div className="space-y-6 text-[15px] text-zinc-400 leading-relaxed">
                  <p>
                    The Creator Studio allows verified contributors to publish valuable articles, career insights, and deep dives directly to the ErithX community.
                  </p>
                  
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">Publishing Guidelines</h4>
                    <ul className="space-y-3 text-sm text-zinc-400">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong className="text-zinc-200">High-Signal Content:</strong> Focus on real engineering, silent building, networking, and actual system design needed for 2026. No generic tutorial dumps.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong className="text-zinc-200">Rich Editor:</strong> Our Tiptap-powered editor supports markdown, syntax highlighting, and rich media to make your articles readable and engaging.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong className="text-zinc-200">Review Process:</strong> All submissions go through a streamlined admin review pipeline to ensure quality before going live.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 4. Notifications */}
              <section id="notifications" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    Notifications & Alerts
                  </h2>
                </div>
                <div className="space-y-5 text-[15px] text-zinc-400 leading-relaxed">
                  <p>
                    You have full control over your notification preferences. From your Settings dashboard, you can toggle alerts for upcoming contests, weekly performance digests, and important platform updates. 
                  </p>
                  <p>
                    We do not spam. Notifications are strictly reserved for actionable items that contribute to your preparation.
                  </p>
                </div>
              </section>

              {/* FAQ CTA Navigation */}
              <section id="faq-navigation" className="scroll-mt-24">
                <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Looking for Frequently Asked Questions?</h3>
                    <p className="text-sm text-zinc-400 max-w-xl">
                      Check out our dedicated FAQ hub for common queries and troubleshooting steps.
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
              <h3 className="text-lg font-semibold text-white mb-1">Ready to get serious?</h3>
              <p className="text-sm text-zinc-400">Connect your profiles and let ErithX guide your preparation.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 text-sm font-bold hover:bg-zinc-200 transition-all">
                Go to Dashboard
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}