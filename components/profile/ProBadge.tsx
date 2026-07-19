import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface ProBadgeProps {
  type?: 'pro' | 'official';
  className?: string;
}

export default function ProBadge({ type = 'pro', className = '' }: ProBadgeProps) {
  if (type === 'official') {
    return (
      <span className={`inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)] ${className}`}>
        <ShieldCheck className="w-3 h-3" /> Official
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)] ${className}`}>
      PRO
    </span>
  );
}
