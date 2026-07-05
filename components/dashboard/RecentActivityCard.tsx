import React from 'react';
import { Activity, CheckCircle, Flame, Trophy, Medal } from 'lucide-react';

export default function RecentActivityCard() {
  return (
    <div className="glass rounded-2xl p-5">
      <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-4">
        <Activity className="w-3.5 h-3.5" /> Recent
      </h2>
      <div className="space-y-3">
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5"><CheckCircle className="w-3 h-3 text-emerald-400" /></div>
          <div><div className="text-[11px] font-medium">Completed CC Starters 244</div><div className="text-[9px] text-zinc-600">4/6 solved • +32 rating • 2h ago</div></div>
        </div>
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Flame className="w-3 h-3 text-orange-400" /></div>
          <div><div className="text-[11px] font-medium">20-day streak!</div><div className="text-[9px] text-zinc-600">67% to Platinum • 5h ago</div></div>
        </div>
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Trophy className="w-3 h-3 text-cyan-400" /></div>
          <div><div className="text-[11px] font-medium">Top 15% in LC Weekly 431</div><div className="text-[9px] text-zinc-600">Almost top-10% for Platinum! • Yesterday</div></div>
        </div>
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Medal className="w-3 h-3 text-yellow-400" /></div>
          <div><div className="text-[11px] font-medium">🥇 Gold Card Unlocked</div><div className="text-[9px] text-zinc-600">Committed Learner • 3 days ago</div></div>
        </div>
      </div>
    </div>
  );
}
