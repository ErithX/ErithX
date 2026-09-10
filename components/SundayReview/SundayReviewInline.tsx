'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import AuthModal from '@/components/AuthModal';
import { useNextSunday } from './useNextSunday';

interface SundayReviewInlineProps {
  className?: string;
}

export default function SundayReviewInline({ className = '' }: SundayReviewInlineProps) {
  const sunday = useNextSunday();
  const { user } = useAuthStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [hasConnectedProfiles, setHasConnectedProfiles] = useState(false);
  const router = useRouter();

  // If logged-in user already connected profiles, hide the card completely
  useEffect(() => {
    if (!user?.id) return;
    let isMounted = true;
    fetch('/api/user/profiles')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        const platforms = data?.profile?.platforms;
        const isConnected = !!(
          platforms?.leetcode?.handle ||
          platforms?.codeforces?.handle ||
          platforms?.github?.handle
        );
        if (isConnected) setHasConnectedProfiles(true);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  if (user && hasConnectedProfiles) {
    return null;
  }

  const handleAction = () => {
    if (user) {
      router.push('/dashboard/settings');
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <aside
        className={`group relative my-10 overflow-hidden rounded-xl border border-rose-500/[0.16] bg-zinc-950/90 p-6 shadow-[0_0_50px_-20px_rgba(244,63,94,0.25)] backdrop-blur-md transition-all duration-300 hover:border-rose-400/30 md:p-7 ${className}`}
        aria-label="Weekly review invitation"
      >
        {/* subtle static ambient rose glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-20 h-56 w-80 rounded-full opacity-60"
          style={{ background: 'radial-gradient(ellipse, rgba(244,63,94,0.14), transparent 70%)', filter: 'blur(40px)' }}
        />
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-300/30 to-transparent" />

        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center md:gap-10">
          {/* left — the pitch */}
          <div className="max-w-xl">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
              <span className="text-xs text-zinc-400">
                Next review: <span suppressHydrationWarning className="font-medium text-zinc-200">{sunday?.label ?? 'Sunday, Sep 13'}</span>
                <span className="text-zinc-600"> · </span>
                <span className="text-rose-300/80 font-medium">9:00 PM IST</span>
              </span>
            </div>
            <h4 className="mb-2 text-xl font-medium tracking-tight text-white md:text-2xl">
              Stop competing blind.
            </h4>
            <p className="text-sm md:text-[15px] leading-relaxed text-zinc-300">
              You are tracking contests, but who is tracking you? Let ErithX AI analyze your LeetCode and Codeforces drops after this weekend's contests.
            </p>
          </div>

          {/* right — action with scattered platform icons */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="flex items-center gap-3 w-full justify-center">
              {/* 3 Scattered Platform Icons */}
              <div className="flex items-center -space-x-2 shrink-0">
                <div 
                  title="LeetCode"
                  className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white ring-2 ring-zinc-950 shadow-lg transform -rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-200 overflow-hidden p-1"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" alt="LeetCode" className="h-full w-full object-contain" />
                </div>
                <div 
                  title="Codeforces"
                  className="relative z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white ring-2 ring-zinc-950 shadow-lg transform translate-y-0.5 hover:translate-y-0 hover:scale-110 transition-all duration-200 overflow-hidden p-1"
                >
                  <img src="https://cdn.iconscout.com/icon/free/png-256/free-code-forces-3628695-3029920.png" alt="Codeforces" className="h-full w-full object-contain" />
                </div>
                <div 
                  title="GitHub"
                  className="relative z-30 flex h-7 w-7 items-center justify-center rounded-full bg-white ring-2 ring-zinc-950 shadow-lg transform rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-200 overflow-hidden p-1"
                >
                  <img src="/icons/github.svg" alt="GitHub" className="h-full w-full object-contain brightness-0 opacity-90" />
                </div>
              </div>

              {/* Curiosity Super CTA */}
              <button
                onClick={handleAction}
                className="group/btn flex items-center justify-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-all duration-200 hover:bg-rose-400 hover:text-white hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] shrink-0"
              >
                <span>{user ? 'Connect Accounts to Unlock' : 'Unlock Free Weekly Reviews'}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </button>
            </div>

            <div className="mt-2.5 flex items-center justify-center gap-1 text-[11px] text-zinc-500 text-center flex-wrap">
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
        </div>
      </aside>
    </>
  );
}
