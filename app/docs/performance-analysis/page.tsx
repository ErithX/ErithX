import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Performance Analysis | ErithX Docs',
  description: 'Understand how ErithX evaluates your coding activity and delivers weekly reviews.',
};

export default function PerformanceAnalysisPage() {
  return (
    <section id="performance-analysis">
      <div className="mb-8 text-sm text-zinc-500 flex items-center gap-2">
        <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/docs" className="hover:text-zinc-300 transition-colors">Docs</Link>
        <span>/</span>
        <span className="text-zinc-300">Performance Analysis</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-4">ErithX Performance Analysis</h1>
      <p className="text-[15px] leading-relaxed text-zinc-400 mb-6">
        The Performance Analysis engine is the core of the ErithX ecosystem. It does not simply count how many problems you solved; it synthesizes your real activity to evaluate if you are actually growing or just staying busy to maintain streaks.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-10 mb-4 pb-2 border-b border-white/[0.05]">How It Evaluates You</h2>
      <p className="text-[15px] leading-relaxed text-zinc-400 mb-4">
        When you connect your profiles (LeetCode, Codeforces, GitHub), our internal system continuously monitors your activity. It evaluates:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-[15px] text-zinc-400 mb-6">
        <li><strong className="text-white font-medium">Target Alignment:</strong> Are your projects and problem choices aligned with your stated goals?</li>
        <li><strong className="text-white font-medium">Engineering Quality:</strong> Are your GitHub projects real engineering efforts, or just tutorial follow-alongs?</li>
        <li><strong className="text-white font-medium">Comfort Zone Traps:</strong> Are you repeatedly solving easy problems to pad your stats instead of pushing into harder topics?</li>
        <li><strong className="text-white font-medium">Consistency:</strong> Are your active days distributed evenly, or are you cramming before deadlines?</li>
      </ul>

      <h2 className="text-2xl font-semibold text-white mt-10 mb-4 pb-2 border-b border-white/[0.05]">The Weekly Cycle</h2>
      <p className="text-[15px] leading-relaxed text-zinc-400 mb-6">
        Your activity is tracked throughout the week. At the end of the cycle, a highly personalized review is generated and delivered directly to your email inbox by <strong className="text-white font-medium">9:00 PM every Sunday</strong>. You can also view your full historical reports from your dashboard.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-10 mb-4 pb-2 border-b border-white/[0.05]">Target Alignment</h2>
      <p className="text-[15px] leading-relaxed text-zinc-400 mb-4">
        To provide accurate feedback, the system needs to know what you are aiming for. You must define your primary goal in <strong className="text-white font-medium">Settings -&gt; Preferences</strong>. The available targets are:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-[15px] text-zinc-400 mb-4">
        <li>Top Tier / FAANG</li>
        <li>Startup Level</li>
        <li>Balanced</li>
        <li>Custom Goal</li>
      </ul>
      <p className="text-[15px] leading-relaxed text-zinc-400 mb-6">
        The system judges your weekly activity against this specific target. What qualifies as "good progress" for a Startup role might differ from what is needed for FAANG.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-10 mb-4 pb-2 border-b border-white/[0.05]">Strictness System & Termination</h2>
      <p className="text-[15px] leading-relaxed text-zinc-400 mb-4">
        ErithX is not a system that encourages everything, even your mistakes. We enforce accountability. If you repeatedly ignore the targets set in your previous reviews or show prolonged inactivity, the system's tone becomes stricter.
      </p>
      <p className="text-[15px] leading-relaxed text-zinc-400 mb-6">
        Continued inactivity or repeated ignorance of targets will lead to the <strong className="text-white font-medium">freezing of your mentorship features</strong>. This is not designed as a punishment, but to ensure you take your preparation seriously.
      </p>

      <div className="p-4 rounded-xl bg-yellow-500/[0.03] border border-yellow-500/20 flex items-start gap-3 my-6">
        <ShieldAlert className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-yellow-400 font-semibold block mb-1">Reactivation Process</span>
          <p className="text-sm text-zinc-400 m-0">
            If your access is frozen, you can request re-activation. Our human team will review your request, your previous behavior history, and your reason for re-engaging.
          </p>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-white/[0.05] flex justify-between items-center">
        <Link href="/docs" className="text-sm text-white hover:text-emerald-400 flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Introduction
        </Link>
        <Link href="/docs/contest-tracker" className="text-sm text-white hover:text-emerald-400 flex items-center gap-2 transition-colors">
          Contest Tracker
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
