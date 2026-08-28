import React from 'react';
import Image from 'next/image';
import { Bell, CalendarCheck, Filter, BookCopy, Download, BadgeCheck, Library, Users, Layers } from 'lucide-react';
import Link from 'next/link';
import AuthCTAButton from './AuthCTAButton';

export default function Ecosystem() {
  return (
    <>
      <section id="ecosystem" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 scroll-reveal">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3 block">The core system</span>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-4">A weekly review that actually reads your behavior.</h2>
          <p className="text-sm text-zinc-500 max-w-xl mx-auto">ErithX doesn’t just show totals. It studies how you work: your consistency, the topics you avoid, how often you stay in your comfort zone, and whether your projects match your goals. Every week, you get a direct report and a focused plan for the next 7 days.</p>
        </div>

        <div className="grid md:grid-cols-6 gap-5">
          {/* Card 1: Core System Features (Large) */}
          <div className="bento-card md:col-span-6 rounded-2xl overflow-hidden relative group border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>
            <div className="relative z-10 p-8 h-full flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="flex-1 space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="glass rounded-xl p-5">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                      <Layers className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-sm font-medium mb-2">Behavior over numbers</div>
                    <div className="text-xs text-zinc-400 leading-relaxed">We don’t care if you solved 500 problems. We care whether you’re getting harder, more consistent, and closer to your target.</div>
                  </div>
                  <div className="glass rounded-xl p-5">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                      <BadgeCheck className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="text-sm font-medium mb-2">Trends over snapshots</div>
                    <div className="text-xs text-zinc-400 leading-relaxed">Your activity is compared week to week. The system notices when you slow down, when you improve, and when you’re just padding easy tasks.</div>
                  </div>
                  <div className="glass rounded-xl p-5">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                      <Filter className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-sm font-medium mb-2">Plans over panic</div>
                    <div className="text-xs text-zinc-400 leading-relaxed">No random grinding. Each review ends with clear targets: what to solve, what to build, and what contests to attend.</div>
                  </div>
                </div>
                <div className="pt-4">
                  <AuthCTAButton className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-all">
                    Start my first weekly review
                  </AuthCTAButton>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Contest intelligence */}
          <div className="bento-card md:col-span-3 rounded-2xl overflow-hidden relative group border border-white/5">
            <Image src="/landing/contest-tracker-banner.avif" fill className="object-cover opacity-30 group-hover:opacity-40 transition-opacity" alt="Contest intelligence" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
            <div className="relative z-10 p-7 h-full flex flex-col justify-end min-h-[360px]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-3 block">Contest intelligence</span>
              <h3 className="text-2xl font-medium tracking-tight mb-2">Never miss the right contest.</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">Track coding contests across 10+ platforms, including LeetCode, Codeforces, CodeChef, AtCoder, and more. Filter by platform and level, add your favorite rounds to Google Calendar in one click, and get an email alert before each contest.</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                    <Filter className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-xs text-zinc-300">10+ platforms in one calendar</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-cyan-500/10 flex items-center justify-center">
                    <CalendarCheck className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <span className="text-xs text-zinc-300">1‑click Google Calendar sync</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center">
                    <Bell className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <span className="text-xs text-zinc-300">Email reminders before your favorite contests</span>
                </div>
              </div>
              
              <div>
                <Link href="/contests" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-all">
                  Browse upcoming contests
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Resources */}
          <div className="bento-card md:col-span-3 rounded-2xl overflow-hidden relative group border border-white/5">
            <Image src="/landing/project-roadmaps.png" fill className="object-cover opacity-25 group-hover:opacity-35 transition-opacity" alt="Resources" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
            <div className="relative z-10 p-7 h-full flex flex-col justify-end min-h-[360px]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-3 block">Resources</span>
              <h3 className="text-2xl font-medium tracking-tight mb-2">Focused articles for the 2026 market.</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">A small, curated set of articles on career strategy, system design, and how to stand out beyond college. No endless lists. Just high‑signal pieces that match the way ErithX thinks about growth.</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                    <BookCopy className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-xs text-zinc-300">How to use LeetCode tags that no one tells</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-cyan-500/10 flex items-center justify-center">
                    <Library className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <span className="text-xs text-zinc-300">System design actually needed for entry level in 2026</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <span className="text-xs text-zinc-300">What to do beyond college: build in public, network, document</span>
                </div>
              </div>

              <div>
                <Link href="/resources" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-all">
                  Explore resources
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
    </>
  );
}
