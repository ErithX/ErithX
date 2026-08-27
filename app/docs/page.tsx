import type { Metadata } from 'next';
import Link from 'next/link';
import { Activity, Swords, Code2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Introduction | ErithX Docs',
  description: 'Learn how ErithX tracks your coding progress and analyzes your weekly performance.',
};

export default function DocsIntroductionPage() {
  return (
    <section id="introduction">
      <div className="mb-8 text-sm text-zinc-500 flex items-center gap-2">
        <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-zinc-300">Docs</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-4">Introduction</h1>
      <p className="text-[15px] leading-relaxed text-zinc-400 mb-6">
        ErithX is a purposeful platform designed to help engineering students maintain consistent, productive weeks. Unlike traditional platforms that focus on vanity metrics, ErithX provides a personalized, internal system-driven mentorship experience. By automatically tracking your connected profiles (including LeetCode, Codeforces, and GitHub), ErithX synthesizes your real progress—going beyond raw stats to evaluate consistency, difficulty, and actual growth.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-10 mb-4 pb-2 border-b border-white/[0.05]">The Core Pillars</h2>
      <p className="text-[15px] leading-relaxed text-zinc-400 mb-6">
        ErithX operates on three foundational pillars designed to streamline your preparation and keep you accountable.
      </p>
      
      <div className="space-y-4 my-6">
        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-white m-0">1. Performance Analysis</h3>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed m-0">
            Weekly, system-driven mentorship that synthesizes your actual coding and development activity. It evaluates if you are progressing or just staying busy.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-3 mb-2">
            <Swords className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-white m-0">2. Contest Tracker</h3>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed m-0">
            A curated tracker for 10+ high-quality platforms. Add contests to your calendar with one click and get email alerts.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-3 mb-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-white m-0">3. Creator Studio</h3>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed m-0">
            A space for verified contributors to publish smart solutions, useful notes, and high-signal career insights for the upcoming competitive era.
          </p>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-white/[0.05] flex justify-between items-center">
        <span className="text-sm text-zinc-500">Next: Performance Analysis</span>
        <Link href="/docs/performance-analysis" className="text-sm text-white hover:text-emerald-400 flex items-center gap-2 transition-colors">
          Performance Analysis
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}