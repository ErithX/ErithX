"use client";

import React from "react";
import { motion } from "framer-motion";
import { Radar, ArrowUpRight } from "lucide-react";

/* the site easing — same expo-out the hero rides */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function Manifesto() {
  const headerRef = useScrollReveal();
  const cardRef = useScrollReveal();

  return (
    <section id="manifesto" className="relative overflow-hidden bg-transparent py-24 font-sans antialiased md:py-40">
      {/* deep wash — the section's quiet purple-blue atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#09090b] via-[#0c0a15] to-[#09090b]" />

      <div className="mx-auto max-w-7xl px-6">

        {/* ================================================================
            HEADER — asymmetric split: headline owns the left,
            philosophy/quote owns the right
            ================================================================ */}
        <div 
          ref={headerRef}
          className="mb-24 grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-16"
        >
          {/* LEFT — primary headline, large text, dramatic pause */}
          <div className="lg:col-span-7">
            <h2 className="text-4xl font-medium leading-[1.05] tracking-tighter text-white sm:text-5xl lg:text-6xl xl:text-7xl sr" style={{ transitionDelay: '0ms' }}>
              A weekly review system, not
              <span className="relative mt-1 block w-fit text-zinc-700">
                another dashboard.
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
                  className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                />
              </span>
            </h2>
          </div>

          {/* RIGHT — body + restored founder quote, bottom-aligned to the headline */}
          <div className="lg:col-span-5 lg:pb-1">
            <div className="max-w-md space-y-4 text-sm leading-relaxed text-zinc-400 sm:text-base sr" style={{ transitionDelay: '200ms' }}>
              <p>
                Most platforms show totals: problems solved, rating, streaks.
              </p>
              <p>
                ErithX studies how you work: your consistency, the topics you avoid, and whether your projects match your goals. Every week you get a direct report and a focused plan for the next 7 days.
              </p>
            </div>
          </div>
        </div>

        {/* ================================================================
            THE CARD — back on its centered stage, ~80% desktop width,
            design untouched
            ================================================================ */}
        <div 
          ref={cardRef}
          className="relative mx-auto w-full max-w-5xl p-4 sm:p-0"
        >
          {/* satellite glows */}
          <div className="pointer-events-none absolute right-20 top-0 h-96 w-96 rounded-full bg-purple-600/15 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 left-20 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />

          <div
            className="group relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-white/[0.08] bg-[#050505] p-5 md:p-14 shadow-2xl sr"
            style={{
              WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)",
              maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)",
              transitionDelay: '0ms'
            }}
            aria-label="Sample global standing analysis card"
          >
            {/* inner top border reflection */}
            <div className="absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* HEADER */}
            <div className="mb-8 md:mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                  <Radar className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-white">Performance Review</h3>
                  <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Week 4 (Sample)
                  </p>
                </div>
              </div>
              <span className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-zinc-500 transition-colors group-hover:text-purple-400">
                View full report
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>

            {/* STATS */}
            <div className="mb-8 md:mb-14 grid grid-cols-2 gap-6 md:gap-24">
              <div>
                <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">Global Percentile</div>
                <div className="flex items-baseline gap-2">
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-4xl font-light leading-none tracking-tighter text-transparent md:text-5xl">
                    Top 8
                  </span>
                  <span className="text-xl font-light text-zinc-500">%</span>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">Focus Score</div>
                  <div className="flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-sm">
                    <span className="text-[9px] font-bold text-zinc-400">?</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-semibold leading-none tracking-tighter text-white md:text-5xl">84</span>
                  <span className="text-xl font-medium text-purple-500">%</span>
                </div>
              </div>
            </div>

            {/* THE LINE — hero's special-phrase treatment: italic, gradient, large */}
            <div
              className="border-l-2 border-purple-400/60 pb-8 md:pb-12 pl-4 md:pl-6 pt-4 md:pt-6 sr"
              style={{ transitionDelay: '500ms' }}
            >
              <p className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-3xl font-medium italic tracking-tighter text-transparent md:text-4xl lg:text-5xl">
                See where you actually stand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}