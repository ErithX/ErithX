import React from 'react';
import { BarChart2 } from 'lucide-react';

export default function SkillMapCard() {
  return (
    <div className="glass rounded-2xl p-5">
      <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-5">
        <BarChart2 className="w-3.5 h-3.5" /> Skill Map
      </h2>
      <div className="flex items-end justify-between gap-2 h-40 mb-2">
        <div className="flex-1 flex flex-col items-center gap-1"><div className="w-full rounded-t-md bg-emerald-500/80 prog-animated" style={{ height: '90%' }}></div><span className="text-[8px] text-zinc-500">DP</span></div>
        <div className="flex-1 flex flex-col items-center gap-1"><div className="w-full rounded-t-md bg-emerald-500/60 prog-animated" style={{ height: '78%' }}></div><span className="text-[8px] text-zinc-500">Str</span></div>
        <div className="flex-1 flex flex-col items-center gap-1"><div className="w-full rounded-t-md bg-emerald-500/50 prog-animated" style={{ height: '75%' }}></div><span className="text-[8px] text-zinc-500">Tree</span></div>
        <div className="flex-1 flex flex-col items-center gap-1"><div className="w-full rounded-t-md bg-yellow-500/50 prog-animated" style={{ height: '65%' }}></div><span className="text-[8px] text-zinc-500">Grph</span></div>
        <div className="flex-1 flex flex-col items-center gap-1"><div className="w-full rounded-t-md bg-yellow-500/40 prog-animated" style={{ height: '50%' }}></div><span className="text-[8px] text-zinc-500">Grdy</span></div>
        <div className="flex-1 flex flex-col items-center gap-1"><div className="w-full rounded-t-md bg-red-500/40 prog-animated" style={{ height: '35%' }}></div><span className="text-[8px] text-zinc-500">Math</span></div>
      </div>
      <div className="flex items-center justify-between text-[9px] text-zinc-600">
        <span>8/10 categories</span>
        <span className="text-emerald-400">Well-rounded</span>
      </div>
    </div>
  );
}
