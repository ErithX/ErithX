import React from 'react';
import Link from 'next/link';
import { Zap, Sparkles } from 'lucide-react';
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
        <div className="flex flex-col gap-1 mt-1">
          <p className="text-sm text-zinc-400">Your next milestone is closer than you think.</p>
          <p className="text-xs text-zinc-500">
            Keep your profile up to date and manage your preferences in <Link href="/dashboard/settings" className="text-emerald-500 hover:text-emerald-400 transition-colors underline underline-offset-2">Settings</Link>.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/dashboard/pro" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-emerald-400 group">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Open Creator Dashboard</span>
          <span className="text-lg leading-none group-hover:translate-x-1 transition-transform">→</span>
        </Link>
        {/* <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass">
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
        </div> */}
      </div>
    </div>
  );
}
