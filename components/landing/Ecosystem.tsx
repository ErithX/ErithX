'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Layers, BadgeCheck, Filter, Globe, CalendarCheck, Bell,
  ArrowUpRight, Clock, Calendar, Radar
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

/* ------------------------------ data ------------------------------ */

type Principle = { icon: LucideIcon; lead: string; tail: string; desc: string; color: string };

const PRINCIPLES: Principle[] = [
  { icon: Layers,     lead: 'Behavior', tail: 'numbers',   desc: 'We don’t focus on how many problems you solved. We focus on whether you’re solving harder problems, staying consistent, and moving toward your target role.', color: 'emerald' },
  { icon: BadgeCheck, lead: 'Trends',   tail: 'snapshots', desc: 'Your activity is compared week to week. The system notices when you slow down, when you improve, and when you’re mostly solving easy tasks.', color: 'cyan' },
  { icon: Filter,     lead: 'Plans',    tail: 'panic',     desc: 'No random grinding. Each review ends with clear targets: what to solve, what to build, and what contests to attend.', color: 'purple' },
];

const CONTEST_FEATURES: { icon: LucideIcon; label: string }[] = [
  { icon: Globe,         label: '10+ platforms in one calendar' },
  { icon: CalendarCheck, label: '1-click Google Calendar sync' },
  { icon: Bell,          label: 'Email reminders before your favorite contests' },
];

const ARTICLES = [
  'How to use LeetCode tags that no one tells',
  'System design actually needed for entry level in 2026',
  'What to do beyond college: build in public, network, document',
];

/* --------------------------- motion kit --------------------------- */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// This variant uses the 'custom' prop to stagger animations based on a delay
const riseVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

// Line animation under text
const markVariants = {
  hidden: { scaleX: 0 },
  visible: (delay: number) => ({
    scaleX: 1,
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

function Mark({
  delay, lineClass, children,
}: {
  delay: number; lineClass: string; children: React.ReactNode;
}) {
  return (
    <span className="relative">
      <span>{children}</span>
      <motion.span
        aria-hidden
        className={`absolute inset-x-0 bottom-[0.08em] h-[2px] origin-left rounded-full ${lineClass}`}
        variants={markVariants}
        custom={delay}
      />
    </span>
  );
}

/* ------------------------------ rows ------------------------------ */

function ContestScatterIllustration() {
  return (
    <motion.div 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, margin: "-100px" }}
      className="relative w-full h-full flex flex-col items-center justify-center min-h-[400px]"
    >
        {/* AMBIENT SATELLITE GLOWS */}
        <div className="pointer-events-none absolute top-10 left-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-10 right-1/4 h-64 w-64 translate-x-1/2 rounded-full bg-emerald-500/10 blur-[80px]" />

        {/* FLOATING FEATURE PILLS */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20, scale: 0.9 },
            visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, delay: 0.8, ease: EASE } }
          }}
          className="absolute top-0 sm:top-12 right-0 sm:right-4 z-30 flex items-center gap-2 rounded-full border border-white/10 bg-[#111]/80 px-4 py-2 shadow-2xl backdrop-blur-xl scale-[0.85] sm:scale-100 origin-top-right"
        >
          <Calendar className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-[10px] font-semibold tracking-wider text-zinc-300 uppercase">Synced to Google</span>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: -20, scale: 0.9 },
            visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, delay: 1, ease: EASE } }
          }}
          className="absolute bottom-2 sm:bottom-20 left-0 sm:left-4 z-30 flex items-center gap-2 rounded-full border border-white/10 bg-[#111]/80 px-4 py-2 shadow-2xl backdrop-blur-xl scale-[0.85] sm:scale-100 origin-bottom-left"
        >
          <Bell className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[10px] font-semibold tracking-wider text-zinc-300 uppercase">Alert Active</span>
        </motion.div>

        {/* CARD 1: CODEFORCES (Smaller, scattered left/back) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, x: -20, y: -20, rotate: -25 },
            visible: { opacity: 1, x: 0, y: 0, rotate: -15, transition: { duration: 1.2, delay: 0.2, ease: EASE } }
          }}
          className="absolute left-2 sm:left-10 top-10 sm:top-16 z-10 w-[85%] max-w-[240px] origin-top-left scale-[0.70] sm:scale-100 group"
        >
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070709] p-5 shadow-2xl backdrop-blur-md transition-transform duration-500 hover:rotate-0 hover:scale-105 hover:z-40"
          >
            <div className="absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-2 rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-1">
                <Globe className="h-3 w-3 text-blue-400" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400">Codeforces</span>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-600 transition-colors group-hover:text-white" />
            </div>
            <h3 className="mb-1 text-sm font-semibold tracking-tight text-white">Educational Round 164</h3>
            <p className="mb-4 text-[11px] font-medium text-zinc-500">Rated for Div. 2</p>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <div className="mb-1 flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-zinc-400" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Starts In</span>
              </div>
              <div className="font-mono text-lg font-medium tracking-tight text-white">08:45:20</div>
            </div>
          </motion.div>
        </motion.div>

        {/* CARD 2: ATCODER (Larger, scattered right/front) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, x: 20, y: 20, rotate: 15 },
            visible: { opacity: 1, x: 0, y: 0, rotate: 6, transition: { duration: 1.2, delay: 0.4, ease: EASE } }
          }}
          className="absolute right-2 sm:right-10 bottom-8 sm:bottom-16 z-20 w-[95%] max-w-[320px] origin-bottom-right scale-[0.70] sm:scale-100 group"
        >
          <motion.div
            animate={{ y: [4, -4, 4] }}
            transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#050605] p-6 shadow-2xl backdrop-blur-md transition-transform duration-500 hover:rotate-0 hover:scale-105 hover:z-40"
          >
            <div className="absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-1">
                <Globe className="h-3 w-3 text-emerald-400" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">AtCoder</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-white" />
            </div>
            <h3 className="mb-1 text-lg font-semibold tracking-tight text-white">Beginner Contest 342</h3>
            <p className="mb-5 text-xs font-medium text-zinc-500">Rated for All</p>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 relative overflow-hidden">
              <div className="mb-1 flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">Status</span>
              </div>
              <div className="font-mono text-2xl font-bold tracking-tight text-emerald-400">LIVE NOW</div>
            </div>
          </motion.div>
        </motion.div>
    </motion.div>
  );
}

function ContestRow() {
  const revealRef = useScrollReveal();
  return (
    <div 
      ref={revealRef}
      className="flex flex-col gap-10 md:gap-16 items-center lg:items-end lg:flex-row max-w-6xl mx-auto"
    >
      {/* Editorial Content */}
      <div className="flex-1 w-full max-w-xl text-left">
        <div className="sr" style={{ transitionDelay: '0ms' }}>
          <div className="relative mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-[#09090b]/80 px-4 py-2 text-xs font-medium text-zinc-300 shadow-2xl backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 rounded-full border-t border-white/[0.12]" />
            <span className="flex h-2 w-2 items-center justify-center rounded-full bg-red-500/20">
              <span className="h-1 w-1 rounded-full bg-red-400" />
            </span>
            <span className="tracking-wide">Contest tracker</span>
          </div>
        </div>

        <h3 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.05] tracking-tighter text-white sr" style={{ transitionDelay: '100ms' }}>
          Never miss the <span className="italic block mt-1">right contest.</span>
        </h3>

        <p className="mt-5 text-[15px] leading-relaxed text-zinc-400 max-w-md sr" style={{ transitionDelay: '200ms' }}>
          Track coding contests across 10+ platforms, including LeetCode, Codeforces, CodeChef, and
          AtCoder. Filter by platform, add your favorite rounds to Google Calendar in one click, and
          get an email reminder before each contest.
        </p>

        <ul className="mt-10 flex flex-col gap-5 border-l-2 border-white/[0.04] pl-5 sr" style={{ transitionDelay: '300ms' }}>
          {CONTEST_FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <li key={feat.label} className="flex items-center gap-4 text-sm text-zinc-300">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.03] text-zinc-500">
                  <Icon className="h-4 w-4" />
                </div>
                <span>{feat.label}</span>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 sr" style={{ transitionDelay: '400ms' }}>
          <Link
            href="/contests"
            className="inline-flex items-center rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-zinc-200 transition-all hover:border-red-500/30 hover:bg-white/5"
          >
            Browse upcoming contests
          </Link>
        </div>
      </div>

      {/* The Scatter Illustration */}
      <div className="w-full lg:w-[600px] xl:w-[700px] shrink-0 sr" style={{ transitionDelay: '500ms' }}>
        <ContestScatterIllustration />
      </div>
    </div>
  );
}

function ResourcesRow() {
  const revealRef = useScrollReveal();
  return (
    <div 
      ref={revealRef}
      className="flex flex-col items-center text-center max-w-3xl mx-auto"
    >
      <div className="sr" style={{ transitionDelay: '0ms' }}>
        <div className="relative mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-[#09090b]/80 px-4 py-2 text-xs font-medium text-zinc-300 shadow-2xl backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 rounded-full border-t border-white/[0.12]" />
          <span className="flex h-2 w-2 items-center justify-center rounded-full bg-purple-500/20">
            <span className="h-1 w-1 rounded-full bg-purple-400" />
          </span>
          <span className="tracking-wide">Resources</span>
        </div>
      </div>

      <h3 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.05] tracking-tighter text-white sr" style={{ transitionDelay: '100ms' }}>
        Focused articles for
        <span className="block mt-2">
          <Mark delay={0.55} lineClass="bg-purple-400/70">DSA and career growth.</Mark>
        </span>
      </h3>

      <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-zinc-400 sr" style={{ transitionDelay: '200ms' }}>
        A small, curated set of articles on DSA strategy, system design, and how to stand out beyond college. These articles complement your weekly ErithX review instead of replacing it.
      </p>

      {/* the reading index */}
      <ul className="mt-10 w-full max-w-md text-left sr" style={{ transitionDelay: '300ms' }}>
        {ARTICLES.map((title) => (
          <li key={title}>
            <Link
              href="/resources"
              className="group/row flex items-center justify-between gap-4 border-t border-white/5 py-4 transition-colors hover:border-purple-400/30"
            >
              <span className="text-[14px] text-zinc-300 transition-colors group-hover/row:text-white">
                {title}
              </span>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-zinc-600 transition-all duration-300 group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5 group-hover/row:text-purple-400"
                strokeWidth={1.5}
              />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 sr" style={{ transitionDelay: '400ms' }}>
        <Link
          href="/resources"
          className="inline-flex items-center rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-zinc-200 transition-all hover:border-purple-400/30 hover:bg-white/5"
        >
          Explore resources
        </Link>
      </div>
    </div>
  );
}

/* ---------------------------- section ---------------------------- */

export default function Ecosystem() {
  const headerRef = useScrollReveal();
  const principlesRef = useScrollReveal();

  return (
    <section id="ecosystem" className="relative px-6 py-24 lg:py-28 overflow-hidden">
      {/* spine glow — faint, emerald, header only */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[10%] top-0 h-[400px] w-[400px] rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)', filter: 'blur(90px)' }}
      />

      <div className="relative mx-auto max-w-6xl">

        {/* ---------- header — left editorial, emerald spine ---------- */}
        <div 
          ref={headerRef}
          className="mb-16 grid gap-12 md:mb-24 lg:grid-cols-12 lg:items-end lg:gap-16"
        >
          <div className="lg:col-span-7">
            <div className="sr" style={{ transitionDelay: '0ms' }}>
              <div className="relative mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-[#09090b]/80 px-4 py-2 text-xs font-medium text-zinc-300 shadow-2xl backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 rounded-full border-t border-white/[0.12]" />
                <span className="flex h-2 w-2 items-center justify-center rounded-full bg-emerald-500/20">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                </span>
                <span className="tracking-wide">The core system</span>
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-[0.95] tracking-tighter text-white sr" style={{ transitionDelay: '100ms' }}>
              A weekly review that
              <br />
              studies your <span className="italic bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent px-1">behavior</span>.
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pb-1 text-[15px] leading-relaxed text-zinc-400 sr" style={{ transitionDelay: '200ms' }}>
            <p>
              ErithX doesn&rsquo;t just show totals. It studies how you work: your consistency, the
              topics you avoid, how often you stay in your comfort zone, and whether your projects
              match your goals. Every week, you get a direct report and a focused plan for the next
              7 days.
            </p>
          </div>
        </div>

        {/* ---------- principles — the spine, before satellites split ---------- */}
        <div 
          ref={principlesRef}
          className="mb-20 grid gap-6 sm:grid-cols-3"
        >
          {PRINCIPLES.map((p, i) => {
            const Icon = p.icon;
            const colorMap = {
              emerald: {
                bg: 'bg-emerald-500/10',
                border: 'border-emerald-500/20',
                text: 'text-emerald-400',
                shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
                grad: 'via-emerald-500/10'
              },
              cyan: {
                bg: 'bg-cyan-500/10',
                border: 'border-cyan-500/20',
                text: 'text-cyan-400',
                shadow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]',
                grad: 'via-cyan-500/10'
              },
              purple: {
                bg: 'bg-purple-500/10',
                border: 'border-purple-500/20',
                text: 'text-purple-400',
                shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]',
                grad: 'via-purple-500/10'
              }
            };
            const styles = colorMap[p.color as keyof typeof colorMap];

            return (
              <div key={p.lead} className="group relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-white/[0.08] bg-[#050505] p-6 shadow-2xl transition-colors hover:bg-white/[0.02] sr" style={{ transitionDelay: `${300 + (i * 100)}ms` }}>
                <div className={`absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-transparent ${styles.grad} to-transparent opacity-0 transition-opacity group-hover:opacity-100`} />
                <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border ${styles.border} ${styles.bg} ${styles.shadow}`}>
                  <Icon className={`h-6 w-6 ${styles.text}`} strokeWidth={1.5} />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-white tracking-tight">
                  {p.lead} <span className="font-normal text-zinc-500">over</span> {p.tail}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* ---------- the two feature rows ---------- */}
        <div className="space-y-24 lg:space-y-32">
          <ContestRow />
          <ResourcesRow />
        </div>
      </div>
    </section>
  );
}