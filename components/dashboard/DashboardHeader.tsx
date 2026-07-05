import React from 'react';
import { Zap } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  user: User | null;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Coder'}
        </h1>
        <p className="text-sm text-zinc-500 mt-0.5">Your next milestone is closer than you think.</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass">
          <span className="text-xl streak-fire">🔥</span>
          <div>
            <div className="text-lg font-bold leading-none mono">23</div>
            <div className="text-[9px] uppercase tracking-widest text-zinc-500">Day Streak</div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-lg font-bold leading-none mono">2h 14m</div>
            <div className="text-[9px] uppercase tracking-widest text-zinc-500">Next Contest</div>
          </div>
        </div>
      </div>
    </div>
  );
}
