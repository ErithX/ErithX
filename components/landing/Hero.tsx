'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';
import AuthCTAButton from './AuthCTAButton';
import HeroConstellation from './HeroConstellation';

import { useScrollReveal } from '@/hooks/useScrollReveal';

/* ------------------------------ hero ------------------------------ */
export default function Hero() {
  const revealRef = useScrollReveal();

  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden px-4 md:px-6 pb-8 md:pb-16 pt-24 md:pt-32 lg:pt-28">
      <div 
        ref={revealRef}
        className="relative mx-auto grid w-full max-w-7xl items-center gap-8 md:gap-12 lg:grid-cols-2 lg:gap-20"
      >
        {/* ============ LEFT — white type, mono micro-label, no pill ============ */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:pr-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tighter leading-[1.05] md:leading-[0.95] mb-4 md:mb-6 sr" style={{ transitionDelay: '100ms' }}>
            Track contests.<br />
            Review habits.<br />
            <span className="italic bg-gradient-to-r from-rose-400 to-red-500 bg-clip-text text-transparent pr-1">Level up</span> every week.
          </h1>

          <p className="text-[14px] sm:text-base text-zinc-400 leading-relaxed max-w-md sr" style={{ transitionDelay: '200ms' }}>
            ErithX syncs your LeetCode, Codeforces, and GitHub activity to diagnose blind spots, track contest schedules, and deliver an actionable 7-day prep plan every Sunday.
          </p>
        

          <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start sr" style={{ transitionDelay: '300ms' }}>
            <AuthCTAButton className="inline-flex items-center gap-2 rounded-xl bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-[14px] sm:text-sm font-semibold sm:font-medium text-zinc-900 shadow-2xl shadow-black/40 transition-transform hover:scale-105">
              <Zap className="h-4 w-4" />
              Get Your Weekly Review
            </AuthCTAButton>
            <Link
              href="/contests"
              prefetch={true}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 sm:px-6 py-2.5 sm:py-3 text-[14px] sm:text-sm font-semibold sm:font-medium text-zinc-300 transition-colors hover:bg-white/5"
            >
              Track coding contests
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-4 text-xs text-zinc-400 sr" style={{ transitionDelay: '360ms' }}>
            Connect your profiles in 2 minutes. Your first weekly review arrives this Sunday.
          </p>
        </div>

        {/* ============ RIGHT — the ecosystem constellation ============ */}
        <div className="sr" style={{ transitionDelay: '300ms' }}>
          <HeroConstellation />
        </div>
      </div>
    </section>
  );
}