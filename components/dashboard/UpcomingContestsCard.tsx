import React from 'react';
import { Calendar } from 'lucide-react';

export default function UpcomingContestsCard() {
  return (
    <div className="glass rounded-2xl p-5">
      <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-4">
        <Calendar className="w-3.5 h-3.5" /> Upcoming
      </h2>
      <div className="space-y-2">
        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
          <div className="flex items-center justify-between mb-1"><span className="text-xs font-medium">CC Starters 245</span><span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">TODAY</span></div>
          <div className="text-[10px] text-zinc-500">8:00 PM IST</div>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between mb-1"><span className="text-xs font-medium">LC Weekly 432</span><span className="text-[8px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded font-bold">TOMORROW</span></div>
          <div className="text-[10px] text-zinc-500">8:00 AM IST</div>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between mb-1"><span className="text-xs font-medium">CF Round 1024</span><span className="text-[8px] bg-white/5 text-zinc-400 px-1.5 py-0.5 rounded font-bold">JUN 26</span></div>
          <div className="text-[10px] text-zinc-500">9:35 PM IST</div>
        </div>
      </div>
    </div>
  );
}
