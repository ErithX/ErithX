"use client";

import React from 'react';
import { Zap, PlayCircle, LayoutDashboard, Users, Flame, Award } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-56px)] flex items-center overflow-hidden grid-bg pt-10 pb-16 mt-6">
      {/* Background effects */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top left, rgba(6,78,59,0.3), #09090b 60%)' }}></div>
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] md:w-[700px] md:h-[700px] rounded-full opacity-[0.08]" style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)', filter: 'blur(100px)' }}></div>
      <div className="absolute bottom-0 left-1/4 w-[250px] h-[250px] md:w-[500px] md:h-[500px] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)', filter: 'blur(80px)' }}></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT: Text Content */}
          <div className="animate-in text-center lg:text-left flex flex-col items-center lg:items-start">
            {/* Live indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-8 mx-auto lg:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="live-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-500"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">The Student-First Platform</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tighter mb-6 gradient-text-hero leading-[1.05]">
              Your Coding<br/>Era Starts<br/>Now.
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
                <img src="https://picsum.photos/seed/herouser1/40/40.jpg" className="w-8 h-8 rounded-full border-2 border-zinc-950 object-cover" alt="User" />
                <img src="https://picsum.photos/seed/herouser2/40/40.jpg" className="w-8 h-8 rounded-full border-2 border-zinc-950 object-cover" alt="User" />
                <img src="https://picsum.photos/seed/herouser3/40/40.jpg" className="w-8 h-8 rounded-full border-2 border-zinc-950 object-cover" alt="User" />
                <img src="https://picsum.photos/seed/herouser4/40/40.jpg" className="w-8 h-8 rounded-full border-2 border-zinc-950 object-cover" alt="User" />
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-white">2,400+ students</div>
                <div className="text-[10px] text-zinc-500">building their era right now</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Image Showcase */}
          <div className="relative animate-in" style={{ animationDelay: '0.2s' }}>
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10">
              <img src="https://picsum.photos/seed/heromain/800/900.jpg" className="w-full h-[560px] object-cover" alt="DSA Quest Platform" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-transparent to-cyan-950/20"></div>
              
              {/* Image label */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <LayoutDashboard className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Unified Dashboard</div>
                    <div className="text-[10px] text-zinc-400">Contests, notes, projects — one view</div>
                  </div>
                  <svg className="w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                </div>
              </div>
            </div>

            {/* Floating Card 1: Contest tracker */}
            <div className="absolute -top-6 -left-6 float-anim hidden md:block">
              <div className="glass rounded-xl p-3 w-52 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="live-pulse absolute inline-flex h-full w-full rounded-full bg-red-500"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-red-400">Live Now</span>
                </div>
                <div className="text-xs font-medium mb-1">Codeforces Round 1023</div>
                <div className="text-[10px] text-zinc-500">Starts in 2h 14m</div>
                <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-zinc-500" />
                  <span className="text-[10px] text-zinc-400">23.1K registered</span>
                </div>
              </div>
            </div>

            {/* Floating Card 2: Streak */}
            <div className="absolute -bottom-8 -right-4 float-anim-delay hidden md:block">
              <div className="glass rounded-xl p-3 w-44 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-yellow-500">Streak</div>
                    <div className="text-sm font-semibold">47 days</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="flex-1 h-1 rounded-full bg-yellow-500/60"></div>
                  <div className="flex-1 h-1 rounded-full bg-yellow-500/60"></div>
                  <div className="flex-1 h-1 rounded-full bg-yellow-500/60"></div>
                  <div className="flex-1 h-1 rounded-full bg-yellow-500/60"></div>
                  <div className="flex-1 h-1 rounded-full bg-yellow-500/30"></div>
                  <div className="flex-1 h-1 rounded-full bg-white/5"></div>
                  <div className="flex-1 h-1 rounded-full bg-white/5"></div>
                </div>
              </div>
            </div>

            {/* Floating Card 3: Milestone */}
            <div className="absolute top-1/3 -right-8 float-anim-slow hidden lg:block">
              <div className="glass rounded-xl p-3 w-40 shadow-2xl" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.08))' }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Award className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-400">Milestone</div>
                    <div className="text-xs font-semibold">100 problems</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 hidden md:flex">
        <span className="text-[9px] uppercase tracking-widest text-zinc-600">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border border-zinc-700 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-zinc-500 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}
