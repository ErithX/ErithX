"use client";

import React from 'react';
import Image from 'next/image';
import { Zap, PlayCircle, LayoutDashboard, Users, Flame, Award } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  // Updated Organic SVG path: Narrower top, wider bottom, with soft gradient fade
  const imageMaskStyle = {
    WebkitMaskImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><defs><linearGradient id='grad' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='black' stop-opacity='0'/><stop offset='0.15' stop-color='black' stop-opacity='1'/></linearGradient></defs><path d='M30,0 C45,25 15,75 0,100 L100,100 L100,0 Z' fill='url(%23grad)'/></svg>")`,
    maskImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><defs><linearGradient id='grad' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='black' stop-opacity='0'/><stop offset='0.15' stop-color='black' stop-opacity='1'/></linearGradient></defs><path d='M30,0 C45,25 15,75 0,100 L100,100 L100,0 Z' fill='url(%23grad)'/></svg>")`,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg pt-[56px] pb-8">
      {/* Background effects */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top left, rgba(6,78,59,0.3), #09090b 60%)' }}></div>
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] md:w-[700px] md:h-[700px] rounded-full opacity-[0.08]" style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)', filter: 'blur(100px)' }}></div>
      <div className="absolute bottom-0 left-1/4 w-[250px] h-[250px] md:w-[500px] md:h-[500px] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)', filter: 'blur(80px)' }}></div>

      {/* ========================================= */}
      {/* DESKTOP FULL-HEIGHT ORGANIC IMAGE (RIGHT) */}
      {/* ========================================= */}
      <div
        className="absolute top-0 right-0 h-full w-1/2 hidden lg:block z-0"
        style={imageMaskStyle}
      >
        <Image
          src="/landing/hero-bg.png"
          fill
          className="object-cover"
          alt="DSA Quest Platform Dashboard Preview showing upcoming contests and analytics"
          priority
        />
        {/* Color overlay blending */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-transparent to-cyan-950/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent"></div>

        {/* Image Label */}
        {/* <div className="absolute bottom-10 left-10 right-10">
          <div className="glass rounded-xl p-4 flex items-center gap-3 backdrop-blur-md">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Unified Dashboard</div>
              <div className="text-[10px] text-zinc-300">Contests, notes, projects — one view</div>
            </div>
            <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
          </div>
        </div> */}
      </div>



      {/* ========================================= */}
      {/* MAIN CONTENT GRID */}
      {/* ========================================= */}
      <div className="max-w-6xl mx-auto px-6 relative z-20 w-full">
        <div className="grid lg:grid-cols-2 items-center">

          {/* LEFT: Minimal Text Content */}
          <div className="animate-in text-center lg:text-left flex flex-col items-center lg:items-start py-20 lg:py-0">


            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tighter mb-6 gradient-text-hero leading-[1.05]">
              Your Coding<br />Era Starts<br />Now.
            </h1>

            <p className="text-lg text-zinc-400 leading-relaxed mb-4 max-w-lg mx-auto lg:mx-0">
              Stop hoarding 50 tabs and missing deadlines. Track every contest, steal the best notes, and flex your hustle.
              Built for students who actually want to win.
            </p>
            <p className="text-sm text-zinc-500 mb-10 max-w-lg mx-auto lg:mx-0">
              Preparation with intent, not burnout. One ecosystem for contests, notes, projects, and the community that gets it.
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap mb-12 w-full">
              <Link href="/resources" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-all shadow-lg shadow-white/5">
                <Users className="w-4 h-4" />
                Explore Community
              </Link>
              <Link href="/contests" className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white/5 transition-all">
                <LayoutDashboard className="w-4 h-4" />
                View Contests
              </Link>
            </div>

            {/* Social proof strip */}
            <div className="flex items-center justify-center lg:justify-start gap-4 w-full">
              <div className="flex -space-x-2">
                <Image src="https://picsum.photos/seed/herouser1/40/40.jpg" width={32} height={32} className="rounded-full border-2 border-zinc-950 object-cover" alt="DSA Quest community student avatar 1" />
                <Image src="https://picsum.photos/seed/herouser2/40/40.jpg" width={32} height={32} className="rounded-full border-2 border-zinc-950 object-cover" alt="DSA Quest community student avatar 2" />
                <Image src="https://picsum.photos/seed/herouser3/40/40.jpg" width={32} height={32} className="rounded-full border-2 border-zinc-950 object-cover" alt="DSA Quest community student avatar 3" />
                <Image src="https://picsum.photos/seed/herouser4/40/40.jpg" width={32} height={32} className="rounded-full border-2 border-zinc-950 object-cover" alt="DSA Quest community student avatar 4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-white">2,400+ students</div>
                <div className="text-[10px] text-zinc-500">building their era right now</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Empty Grid Spacer (Visual space for absolute image on desktop) */}
          <div className="hidden lg:block"></div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 hidden md:flex z-20">
        <span className="text-[9px] uppercase tracking-widest text-zinc-600">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border border-zinc-700 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-zinc-500 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}