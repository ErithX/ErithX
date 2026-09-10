"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, BellRing } from 'lucide-react';

/* Premium Apple-style ease */
const EASE = [0.16, 1, 0.3, 1] as const;

const PLATFORMS = [
  'leetcode', 'codeforces', 'codechef', 'hackerrank', 'hackerearth',
  'geeksforgeeks', 'topcoder', 'kaggle', 'google', 'meta', 'apple', 'atcoder',
];

function MarqueeItem({ p }: { p: string }) {
  if (p === 'atcoder') {
    return (
      <span className="flex shrink-0 items-center justify-center rounded-sm border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] font-black text-white hover:scale-110 hover:border-zinc-500 transition-all duration-300">
        AC
      </span>
    );
  }
  return (
    <img
      src={`https://cdn.simpleicons.org/${p}`}
      alt={p}
      className="h-6 w-auto shrink-0 opacity-70 transition-all duration-300 hover:scale-110 hover:opacity-100"
      onError={(e) => { e.currentTarget.style.display = 'none'; }}
    />
  );
}

export default function ContestHero({ liveCount = 0 }: { liveCount?: number }) {
  // SSR-safe animation variant
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 48 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section className="relative flex items-center overflow-hidden px-4 md:px-6 pt-28 md:pt-36 pb-6 md:pb-10">
      {/* Ambient backgrounds */}
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at top, rgba(6,78,59,0.25), #09090b 60%)' }} />
      <div className="pointer-events-none absolute left-1/3 top-0 h-[600px] w-[600px] rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative z-10 mx-auto w-full max-w-3xl text-center flex flex-col items-center">

        {/* Live Pill (Matching homepage premiumness) */}
        <motion.div {...rise(0)}>
          <div className="relative inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-[#09090b]/80 px-4 py-2 text-xs font-medium text-zinc-300 shadow-2xl backdrop-blur-xl mb-4 md:mb-6">
            <div className="absolute inset-0 rounded-full border-t border-white/[0.12] pointer-events-none" />
            <span className="flex h-2 w-2 items-center justify-center rounded-full bg-white/[0.1]">
              <span className={`h-1 w-1 rounded-full ${liveCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-400'}`} />
            </span>
            <span className="tracking-wide">
              {liveCount > 0 ? `${liveCount} live now` : 'Live and Upcoming'}
            </span>
          </div>
        </motion.div>

        {/* Headline (Matching homepage typography exactly) */}
        <motion.h1 
          {...rise(0.1)}
          className="text-[2.25rem] sm:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-tighter leading-[1.05] md:leading-[0.95] mb-4 md:mb-6 text-white"
        >
          Never miss a<br />
          <span className="italic bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent pr-1">
            contest
          </span>{' '}
          again.
        </motion.h1>

        {/* Subhead */}
        <motion.p 
          {...rise(0.2)}
          className="text-[14px] sm:text-base text-zinc-400 leading-relaxed max-w-md mx-auto"
        >
          Track every contest, hackathon, and interview sprint across{' '}
          <span className="font-medium text-white">10+ platforms</span> — with alerts that reach
          your inbox <span className="font-medium text-emerald-400">before anyone else</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          {...rise(0.3)}
          className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#contests"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-[14px] sm:text-sm font-semibold sm:font-medium text-zinc-900 shadow-2xl shadow-black/40 transition-transform hover:scale-105"
          >
            <Trophy className="h-4 w-4" />
            View live contests
          </a>
          <a
            href="#community"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 sm:px-6 py-2.5 sm:py-3 text-[14px] sm:text-sm font-semibold sm:font-medium text-zinc-300 transition-colors hover:bg-white/5"
          >
            <BellRing className="h-4 w-4" />
            Get email alerts
          </a>
        </motion.div>

        {/* ============ MARQUEE ============ */}
        <motion.div 
          {...rise(0.4)}
          className="mt-10 md:mt-14 overflow-hidden w-full"
        >
          <div className="mask-edges relative w-full opacity-60 transition-opacity duration-300 hover:opacity-100">
            <div className="animate-marquee flex items-center gap-12 py-2">
              {[0, 1].map((half) => (
                <span key={half} aria-hidden={half === 1} className="contents">
                  {PLATFORMS.map((p, i) => (
                    <MarqueeItem key={`${half}-${i}`} p={p} />
                  ))}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .mask-edges {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        @keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
        .animate-marquee { display: flex; width: max-content; animation: marquee 28s linear infinite }
        .animate-marquee:hover { animation-play-state: paused }
        @media (prefers-reduced-motion: reduce) { .animate-marquee { animation: none } }
      `}</style>
    </section>
  );
}