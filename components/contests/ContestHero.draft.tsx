"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trophy, Activity } from 'lucide-react';
import { Instrument_Serif } from 'next/font/google';

/* Shared font configuration */
const serif = Instrument_Serif({ 
  subsets: ['latin'], 
  weight: '400', 
  style: ['italic'], 
  display: 'swap' 
});

/* Premium Apple-style ease */
const EASE = [0.16, 1, 0.3, 1] as const;

export default function ContestHero({ liveCount = 0 }: { liveCount?: number }) {
  // SSR-safe animation variant
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section className="relative w-full pt-20 pb-10 lg:pt-28 lg:pb-12 px-6 overflow-hidden border-b border-white/5">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at top, rgba(16,185,129,0.08), #09090b 70%)' }} />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left z-20">
            
            {/* Live Pill */}
            <motion.div {...rise(0)}>
              <div className="relative inline-flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 shadow-2xl backdrop-blur-xl">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                  {liveCount > 0 ? `${liveCount} contests live now` : '1-Click Calendar Sync'}
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              {...rise(0.1)}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tighter text-white"
            >
              Never miss a match.<br />
              Master your <span className={`bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-[1.05em] italic text-transparent ${serif.className}`}>performance.</span>
            </motion.h1>

            {/* Subhead */}
            <motion.p 
              {...rise(0.2)}
              className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-400"
            >
              Sync upcoming contests instantly to your calendar. Turn every submission into <span className="text-zinc-200 font-medium">Sunday Verdict</span> insights for your 2026+ career readiness.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              {...rise(0.3)}
              className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3"
            >
              <a
                href="#contests"
                className="group flex h-10 sm:h-11 items-center gap-2 rounded-xl bg-white px-5 sm:px-6 text-xs sm:text-sm font-semibold text-zinc-900 shadow-xl shadow-emerald-500/10 transition-transform hover:scale-105 active:scale-95"
              >
                <Trophy className="h-4 w-4" />
                Live Contests
              </a>
              <Link
                href="/docs/performance-analysis"
                className="group flex h-10 sm:h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 sm:px-6 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-white/10 active:scale-95"
              >
                <Activity className="h-4 w-4 text-cyan-400" />
                Sunday Verdict
              </Link>
            </motion.div>
          </div>

          {/* Right Visual Column (Using EXACT images from Feature page) */}
          <motion.div 
            {...rise(0.4)}
            className="relative w-full mt-8 lg:mt-0"
          >
             {/* Desktop Image Composition */}
             <div className="hidden lg:flex relative items-center justify-end w-full">
                <div className="relative w-full max-w-[700px] flex items-center justify-end translate-x-4 lg:translate-x-8">
                  {/* Floating Left Callout: Icons.png (Gmail & Calendar Sync Badges) */}
                  <div className="absolute top-[10%] left-[-5%] w-[40%] z-30 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                    <Image 
                      src="/Features/Icons.png" 
                      alt="Alert & Sync Integrations" 
                      width={700}
                      height={700}
                      quality={100}
                      unoptimized
                      className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(239,68,68,0.2)] hover:scale-105 transition-transform duration-500" 
                      priority
                    />
                  </div>

                  {/* Main Prominent Right Showcase: Contest-cards.png */}
                  <div className="relative w-full z-10 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                    <Image 
                      src="/Features/Contest-cards.png" 
                      alt="Live Contest Cards" 
                      width={1400}
                      height={1000}
                      quality={100}
                      unoptimized
                      className="w-full h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] hover:scale-[1.02] transition-transform duration-500" 
                      priority
                    />
                  </div>
                </div>
             </div>

             {/* Mobile Image */}
             <div className="lg:hidden relative flex items-center justify-center w-full">
               <Image 
                  src="/Features/test.png" 
                  alt="Live Contest Alerts" 
                  width={800}
                  height={800}
                  quality={100}
                  unoptimized
                  className="w-full max-w-[320px] sm:max-w-sm h-auto object-contain drop-shadow-2xl" 
                  priority
                />
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}