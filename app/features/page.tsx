import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CalendarPlus, Swords, BookOpen, Bell, ShieldCheck, Zap, ArrowRight, CheckCircle2, Flame, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Official Platform Features — 1-Click Calendar Sync & Career Readiness | DSA Quest',
  description: 'Discover the full suite of DSA Quest features: 1-Click Google Calendar contest sync, multi-platform contest tracking, project blueprints with PDFs, and zero-burnout placement prep.',
  keywords: 'DSA Quest features, 1-click google calendar contest sync, coding contest tracker, competitive programming calendar, project blueprints with pdfs, software engineering career readiness, zero burnout placement prep',
};

export default function FeaturesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'DSA Quest Official Features',
    url: 'https://contest-tracker-zms3.vercel.app/features',
    description: 'Detailed overview of DSA Quest platform features including 1-Click Google Calendar Sync, Contest Tracking, and Practical Career Readiness resources.',
  };

  const features = [
    {
      id: 'calendar-sync',
      icon: CalendarPlus,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      badge: 'PRO HIGHLIGHT',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      title: '1-Click Google Calendar & iCal Sync',
      subtitle: 'Never miss a contest match again',
      description: 'Add upcoming coding contests directly to your Google Calendar or Apple Calendar with a single click. Automatically calculates start/end times in your exact local timezone, attaches direct contest URLs, and sets custom reminder notifications.',
      highlights: [
        'Automatic UTC to local timezone conversion',
        'Direct contest participation link attached to event details',
        'Works instantly on mobile & desktop without extensions',
        'Support for Google Calendar, Apple Calendar, & Outlook (.ics)'
      ]
    },
    {
      id: 'contest-tracker',
      icon: Swords,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      badge: 'LIVE AGGREGATOR',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      title: 'Multi-Platform Coding Contest Aggregator',
      subtitle: '10+ Major Platforms in One Unified View',
      description: 'Stop juggling 10 browser tabs across LeetCode, Codeforces, CodeChef, AtCoder, HackerRank, GeeksforGeeks, and Kaggle. View live status, precise countdown timers, participant numbers, and difficulty levels in one clean dashboard.',
      highlights: [
        'Real-time live, today, and upcoming contest filters',
        'Accurate live countdown timers down to the second',
        'Direct one-click participation links to official contest pages',
        'Filter by platform, difficulty level, and recommended contests'
      ]
    },
    {
      id: 'career-readiness',
      icon: BookOpen,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
      badge: '2026+ CAREER FOCUS',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      title: 'Practical Career Readiness & Project Blueprints',
      subtitle: 'Build Real-World Products, Not Rote Tutorials',
      description: 'Access high-yield software engineering guides, interview system architecture breakdowns, and downloadable Project Blueprints with PDFs. Designed specifically for 2026+ hiring standards to help you thrive alongside AI.',
      highlights: [
        'Curated Project Blueprints with downloadable PDF architectures',
        'System design guides for modern RAG, Vector DBs, & Microservices',
        'AI-Era software engineering growth guides & interview playbooks',
        'Zero generic fluff or outdated academic exam material'
      ]
    },
    {
      id: 'email-alerts',
      icon: Bell,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10 border-yellow-500/20',
      badge: 'AUTOMATED DIGEST',
      badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      title: 'Smart Contest Alerts & Weekly Digest',
      subtitle: 'Stay in Sync Without Inbox Spam',
      description: 'Receive custom notification alerts before major contests start and get top engineering guides delivered straight to your inbox via our weekly product & career digest.',
      highlights: [
        'Timely email reminders for recommended contest matches',
        'Weekly digest highlighting top community project blueprints',
        'Granular email preferences — enable or disable anytime',
        'Zero marketing spam, strictly high-yield prep content'
      ]
    },
    {
      id: 'creator-studio',
      icon: Sparkles,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      badge: 'PEER PUBLISHING',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      title: 'Creator Studio & Engineering Publisher',
      subtitle: 'Share Knowledge, Build Reach & Verified Credibility',
      description: 'A dedicated publishing environment for senior engineering students, competitive programmers, and technical authors to publish high-intent guides, algorithm breakdowns, and project blueprints.',
      highlights: [
        'Rich markdown & code editor with instant draft saving',
        'Verified contributor badges for approved authors',
        'Impression analytics & total reach dashboard',
        'Public author profiles showcasing written engineering guides'
      ]
    },
    {
      id: 'burnout-free',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      badge: 'SANCTUARY VIBE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      title: 'Burnout-Free Anti-Anxiety Sanctuary',
      subtitle: 'Prep with Intent, Passion, & Mental Clarity',
      description: 'Designed from the ground up as a focused digital sanctuary. We cut out toxic ranking pressure, aggressive streak locks, and endless tab chaos so you can prepare with passion and enjoy the grind.',
      highlights: [
        'Clean, dark-mode glassmorphic interface built for deep focus',
        'Zero distraction banners, ads, or clickbait popups',
        'Focus on long-term software craftsmanship over toxic comparison',
        'Empowering mindset to clear placement anxiety with sanity intact'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-emerald-500/30 selection:text-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-6 max-w-7xl mx-auto w-full">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            Official Platform Capabilities
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Engineered for <span className="gradient-text-hero">2026+ Career Success</span> & Contest Mastery
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            DSA Quest cuts away the chaotic noise of traditional prep sites. Track every coding contest with 1-click Google Calendar sync, access project blueprints with PDFs, and build your career without burnout.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                className="glass rounded-2xl p-6 border border-white/5 flex flex-col justify-between hover:border-white/15 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.bg}`}>
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-xs text-zinc-400 font-medium mb-4">{item.subtitle}</p>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-2">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-zinc-300">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${item.color} shrink-0 mt-0.5`} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action Banner */}
        <div className="glass rounded-2xl p-8 md:p-12 border border-emerald-500/20 bg-gradient-to-r from-emerald-950/20 via-zinc-950 to-cyan-950/20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Ready to Upgrade Your Software Preparation?
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Start tracking live contests, sync matches to your calendar, and explore curated project blueprints with PDFs today.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
              <Link 
                href="/contests"
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Swords className="w-4 h-4" />
                Track Live Contests
              </Link>
              <Link 
                href="/resources"
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-sm font-semibold transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Explore Career Resources
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
