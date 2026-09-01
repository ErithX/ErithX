'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
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
          <div className="sr" style={{ transitionDelay: '0ms' }}>
            <div className="relative inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-[#09090b]/80 px-4 py-2 text-xs font-medium text-zinc-300 shadow-2xl backdrop-blur-xl mb-8">
              <div className="absolute inset-0 rounded-full border-t border-white/[0.12] pointer-events-none" />
              <span className="flex h-2 w-2 items-center justify-center rounded-full bg-white/[0.1]">
                <span className="h-1 w-1 rounded-full bg-zinc-400" />
              </span>
              <span className="tracking-wide">For engineering students who are already grinding</span>
            </div>
          </div>

          <h1 className="text-[2.25rem] sm:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-tighter leading-[1.05] md:leading-[0.95] mb-4 md:mb-6 sr" style={{ transitionDelay: '100ms' }}>
            Your coding<br />
            <span className="italic bg-gradient-to-r from-rose-400 to-red-500 bg-clip-text text-transparent pr-1">era</span>, with<br />
            direction.
          </h1>

          <p className="text-[14px] sm:text-base text-zinc-400 leading-relaxed max-w-md sr" style={{ transitionDelay: '200ms' }}>
            ErithX connects your LeetCode, Codeforces, and GitHub activity and gives you an honest weekly review. You get clear feedback on your habits and a focused plan for the next 7 days, plus a contest calendar with Google sync.
          </p>
          <p className="mt-3 text-sm sm:text-base italic text-zinc-300 sr" style={{ transitionDelay: '260ms' }}>
            Preparation with intent, not burnout.
          </p>

          <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start sr" style={{ transitionDelay: '300ms' }}>
            <AuthCTAButton className="inline-flex items-center gap-2 rounded-xl bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-[14px] sm:text-sm font-semibold sm:font-medium text-zinc-900 shadow-2xl shadow-black/40 transition-transform hover:scale-105">
              <Zap className="h-4 w-4" />
              Start my first weekly review
            </AuthCTAButton>
            <Link
              href="/contests"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 sm:px-6 py-2.5 sm:py-3 text-[14px] sm:text-sm font-semibold sm:font-medium text-zinc-300 transition-colors hover:bg-white/5"
            >
              Track coding contests
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-4 text-xs text-zinc-500 sr" style={{ transitionDelay: '360ms' }}>
            Connect your profiles in minutes. Get your first plan this week.
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