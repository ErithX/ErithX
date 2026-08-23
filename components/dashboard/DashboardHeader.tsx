import React from 'react';
import { User } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  user: User | null;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Coder';

  return (
    <header className="border-b border-white/5 pb-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-xs text-zinc-500 mb-1.5 tracking-wide">Dashboard</div>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white">
            Welcome back, <span className="text-emerald-400 font-medium">{firstName}</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-2 font-light">Consistency builds mastery. Let's make today count.</p>
        </div>
      </div>
    </header>
  );
}
