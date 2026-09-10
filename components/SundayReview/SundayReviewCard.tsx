'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import AuthModal from '@/components/AuthModal';
import { useNextSunday } from './useNextSunday';

interface SundayReviewCardProps {
  className?: string;
}

export default function SundayReviewCard({ className = '' }: SundayReviewCardProps) {
  const sunday = useNextSunday();
  const { user } = useAuthStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const router = useRouter();

  const handleAction = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <div
        className={`group relative overflow-hidden rounded-xl border border-rose-500/[0.16] bg-zinc-950/90 p-5 shadow-[0_0_40px_-20px_rgba(244,63,94,0.25)] backdrop-blur-md transition-all duration-300 hover:border-rose-400/30 ${className}`}
      >
        {/* subtle static ambient rose glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-10 h-32 w-32 rounded-full opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.15), transparent 70%)', filter: 'blur(28px)' }}
        />
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-300/30 to-transparent" />

        {/* header — clean, human appointment line */}
        <div className="mb-3.5 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
          <span className="text-xs text-zinc-400">
            Next review: <span suppressHydrationWarning className="font-medium text-zinc-200">{sunday?.label ?? 'Sunday, Sep 13'}</span>
          </span>
        </div>

        {/* title */}
        <h4 className="mb-2 text-[16px] font-medium leading-snug text-zinc-100">
          Weekly Review
        </h4>

        {/* body */}
        <p className="mb-5 text-xs leading-relaxed text-zinc-400">
          Connect your LeetCode, Codeforces, and GitHub. Every Sunday at 9 PM you’ll get an honest verdict on your week and a focused 7‑day plan.
        </p>

        {/* CTA button */}
        <button
          onClick={handleAction}
          className="group/btn flex w-full items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2.5 text-xs font-semibold text-zinc-950 transition-all duration-200 hover:bg-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]"
        >
          <span>{user ? 'Open Dashboard' : 'Start my first weekly review'}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
        </button>

        {/* small trust line under button */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 text-center flex-wrap">
          <span>Free for students</span>
          <span className="text-zinc-600">·</span>
          <Link
            href="/docs/performance-analysis"
            className="text-zinc-400 hover:text-zinc-200 transition-colors inline-flex items-center gap-0.5"
          >
            How the weekly review works <ArrowUpRight className="h-2.5 w-2.5" />
          </Link>
        </div>
      </div>
    </>
  );
}

