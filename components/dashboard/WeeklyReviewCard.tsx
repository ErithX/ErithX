import React from 'react';
import { BarChart3, Sparkles } from 'lucide-react';

export default function WeeklyReviewCard() {
  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-4">
        <BarChart3 className="w-3.5 h-3.5" /> Weekly Review
      </h2>
      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5"><div className="text-xl font-bold mono text-emerald-400">12</div><div className="text-[9px] uppercase tracking-wider text-zinc-500">Problems</div></div>
        <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5"><div className="text-xl font-bold mono text-cyan-400">3</div><div className="text-[9px] uppercase tracking-wider text-zinc-500">Contests</div></div>
        <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5"><div className="text-xl font-bold mono text-purple-400">+87</div><div className="text-[9px] uppercase tracking-wider text-zinc-500">Rating Δ</div></div>
        <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5"><div className="text-xl font-bold mono text-orange-400">7/7</div><div className="text-[9px] uppercase tracking-wider text-zinc-500">Streak</div></div>
      </div>
      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Sparkles className="w-3.5 h-3.5 text-emerald-400" /></div>
        <p className="text-xs text-zinc-400 leading-relaxed">Graph accuracy dropped to 42%. Focus on BFS/DFS — try <span className="text-emerald-400">LC 200</span> and <span className="text-emerald-400">CF 1833D</span>. Your DP is strong (78%) — maintain it while you level up graphs.</p>
      </div>
    </div>
  );
}
