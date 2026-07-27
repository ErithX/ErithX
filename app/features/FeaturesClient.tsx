"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  CalendarPlus, BookOpen, Zap, ArrowRight, 
  Globe, Code2, Sparkles, BadgeCheck, Swords, Layers, FileText
} from 'lucide-react';

// Custom Hook for Scroll Reveal Animations
const useInView = (options?: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(entry.target); // Animate only once
      }
    }, { threshold: 0.15, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return { ref, inView };
};

// Reveal Wrapper Component
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function FeaturesClient() {
  // Reusable mask styles for blending images into black
  const maskStyles = {
    fadeBottom: { WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' },
    fadeLeft: { WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)', maskImage: 'linear-gradient(to left, black 60%, transparent 100%)' },
    fadeRight: { WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)', maskImage: 'linear-gradient(to right, black 60%, transparent 100%)' },
    fadeRadial: { WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 75%)', maskImage: 'radial-gradient(circle at center, black 40%, transparent 75%)' }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-emerald-900 selection:text-white flex flex-col font-sans overflow-hidden">
      <Navbar />

      <main className="relative flex-1">
        
        {/* ========================================================= */}
        {/* HEADER HERO - Massive Typography                           */}
        {/* ========================================================= */}
        <section className="relative pt-40 pb-32 px-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full opacity-[0.1] pointer-events-none" style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)', filter: 'blur(120px)' }}></div>
          
          <div className="max-w-6xl mx-auto text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium mb-8 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Built for the 2026+ Engineering Era
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-medium tracking-tighter leading-[0.9] mb-8">
                <span className="block text-white">Zero noise.</span>
                <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">Pure focus.</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-12">
                Stop hoarding tabs and grinding blindly. Synchronize matches, access elite project blueprints, and accelerate your career without the burnout.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link href="/contests" className="px-8 py-4 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:scale-105 transition-transform flex items-center gap-2 shadow-2xl shadow-emerald-500/10">
                  <Zap className="w-4 h-4" /> Explore Contests
                </Link>
                <Link href="/docs" className="px-8 py-4 rounded-xl border border-white/10 text-white text-sm font-semibold hover:bg-white/5 transition-colors flex items-center gap-2 backdrop-blur-md">
                  Read the Docs <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ========================================================= */}
        {/* FEATURE 1: CALENDAR SYNC - Edge Blended Image Right       */}
        {/* ========================================================= */}
        <section className="relative py-20 lg:py-32 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            {/* Left Text */}
            <div className="z-10 space-y-6">
              <Reveal>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
                  <CalendarPlus className="w-3.5 h-3.5" /> 1-Click Sync
                </div>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="text-5xl md:text-6xl font-medium tracking-tighter leading-tight">
                  Never miss a <br/> <span className="text-zinc-600">contest match.</span>
                </h2>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-lg text-zinc-400 max-w-md leading-relaxed">
                  Add matches to Google or Apple Calendar instantly. Auto-converted to your local timezone with direct URLs attached.
                </p>
              </Reveal>
            </div>

            {/* Right Side: Precision Positioned Images (Desktop) */}
            <div className="hidden lg:flex relative items-center justify-end min-h-[600px]">
              <Reveal delay={300} className="relative w-full max-w-[850px] flex items-center justify-end">
                
                {/* Floating Left Callout: Icons.png (Gmail & Calendar Sync Badges) */}
                <div className="absolute top-[90px] left-[-150px] w-[360px] z-30 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Image 
                    src="/Features/Icons.png" 
                    alt="Gmail Alert & Calendar Sync Integrations" 
                    width={700}
                    height={700}
                    quality={100}
                    unoptimized
                    className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(239,68,68,0.3)] hover:scale-105 transition-transform duration-500" 
                    priority
                  />
                </div>

                {/* Main Prominent Right Showcase: Contest-cards.png (Codeforces & CodeChef Cards HUGE) */}
                <div className="relative w-[800px] translate-x-20 z-10 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <Image 
                    src="/Features/Contest-cards.png" 
                    alt="Live Codeforces & CodeChef Contest Cards" 
                    width={1400}
                    height={1000}
                    quality={100}
                    unoptimized
                    className="w-full h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.95)] hover:scale-[1.02] transition-transform duration-500" 
                    priority
                  />
                </div>

              </Reveal>
            </div>

            {/* Right Side: Mobile Optimized Image (Mobile) */}
            <div className="lg:hidden relative flex items-center justify-center mt-12 w-full">
              <Reveal delay={300} className="relative w-full max-w-sm">
                <Image 
                  src="/Features/test.png" 
                  alt="Live Codeforces & CodeChef Contest Alerts" 
                  width={800}
                  height={800}
                  quality={100}
                  unoptimized
                  className="w-full h-auto object-contain drop-shadow-2xl" 
                  priority
                />
              </Reveal>
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* FEATURE 2: TRACKER - Full Width Panorama Blended           */}
        {/* ========================================================= */}
        <section className="relative py-20 lg:py-32 px-6">
          <div className="max-w-7xl mx-auto text-center mb-10 lg:mb-16">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Globe className="w-3.5 h-3.5" /> Universal Tracker
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter leading-none mb-6">
                10+ Platforms. <br/> <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">One Dashboard.</span>
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-lg text-zinc-400 max-w-xl mx-auto">
                LeetCode, Codeforces, CodeChef & more. Aggregated into a single, zero-noise feed with real-time countdowns.
              </p>
            </Reveal>
          </div>

          {/* Full Width Blended Image */}
          <Reveal delay={300}>
            <div className="relative w-full max-w-7xl mx-auto mt-12 rounded-t-2xl overflow-hidden border-t border-x border-white/10 border-b-0 bg-transparent p-2 md:p-4 pb-0">
              <div 
                className="w-full relative"
                style={maskStyles.fadeBottom}
              >
                <Image 
                  src="/Features/Contestdashboard.png" 
                  alt="DSA Quest Universal Contest Board Dashboard" 
                  width={1920}
                  height={1080}
                  quality={100}
                  unoptimized
                  className="w-full h-auto rounded-t-xl object-contain hover:scale-[1.01] transition-transform duration-500" 
                  priority
                />
              </div>
            </div>
          </Reveal>
        </section>

        {/* ========================================================= */}
        {/* FEATURE 3: BLUEPRINTS - Floating Overlapping Cards         */}
        {/* ========================================================= */}



        <section className="relative py-20 lg:py-32 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            {/* Left Minimalist Flow Diagram & Premium SDE Typography Card */}
            <div className="relative h-[480px] flex items-center justify-center">
              
              {/* Tilted Glass Card Container */}
              <Reveal className="w-full max-w-lg transform -rotate-3 hover:rotate-0 transition-transform duration-700 ease-out">
                <div className="glass rounded-2xl p-7 border border-purple-500/30 bg-zinc-950/95 shadow-2xl space-y-6 backdrop-blur-2xl relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition-all"></div>
                  
                  {/* Optimized Big Headline */}
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-400 block mb-2">
                      2026+ SDE Readiness Protocol
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-medium tracking-tight text-white leading-tight">
                      Production-Grade <br/>
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                        SDE Resource Vault
                      </span>
                    </h3>
                  </div>

                  {/* Clean Premium UI Flowchart */}
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold border-b border-white/5 pb-2 mb-3 flex items-center justify-between">
                      <span>System Roadmap Flowchart</span>
                      <span className="text-emerald-400 text-[9px] font-mono flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        VERIFIED
                      </span>
                    </div>

                    {/* Step 1 */}
                    <div className="flex items-center gap-3 group/step">
                      <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-[10px] font-bold text-purple-400 font-mono shrink-0 transition-all group-hover/step:scale-110 group-hover/step:bg-purple-500/20">01</div>
                      <span className="text-xs text-zinc-300 font-medium flex-1">Algorithmic Foundations</span>
                      <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[9px] text-zinc-400 border border-white/5 hidden sm:block">Core</span>
                    </div>

                    {/* Connector 1 */}
                    <div className="flex justify-center pl-4 h-5">
                      <div className="w-px h-full bg-gradient-to-b from-purple-500/50 to-cyan-500/50 border-r border-dashed border-white/10"></div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-center gap-3 group/step">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[10px] font-bold text-cyan-400 font-mono shrink-0 transition-all group-hover/step:scale-110 group-hover/step:bg-cyan-500/20">02</div>
                      <span className="text-xs text-zinc-300 font-medium flex-1">Microservices & PDF Specs</span>
                      <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[9px] text-zinc-400 border border-white/5 hidden sm:block">Blueprints</span>
                    </div>

                    {/* Connector 2 */}
                    <div className="flex justify-center pl-4 h-5">
                      <div className="w-px h-full bg-gradient-to-b from-cyan-500/50 to-emerald-500/50 border-r border-dashed border-white/10"></div>
                    </div>

                    {/* Step 3 - Highlighted Target */}
                    <div className="flex items-center gap-3 p-1.5 pr-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 group/step">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] font-bold text-emerald-400 font-mono shrink-0 transition-all group-hover/step:scale-110">03</div>
                      <span className="text-xs text-emerald-300 font-semibold flex-1">2026 SDE Ready & Playbooks</span>
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>

                  {/* Bottom Footer Specs */}
                  <div className="flex items-center justify-between text-xs text-zinc-400 pt-1 border-t border-white/5">
                    <span className="flex items-center gap-1.5"><FileText className="w-3 h-3"/> PDF Blueprints • Vector DB Spec</span>
                    <span className="text-purple-400 font-bold font-mono flex items-center gap-1 group-hover:gap-2 transition-all">Explore Vault <ArrowRight className="w-3 h-3"/></span>
                  </div>

                </div>
              </Reveal>

            </div>

            {/* Right Text */}
            <div className="z-10 space-y-6">
              <Reveal>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-4">
                  <BookOpen className="w-3.5 h-3.5" /> Modern Career Readiness
                </div>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="text-5xl md:text-6xl font-medium tracking-tighter leading-tight">
                  Build products, <br/> <span className="text-zinc-600">not tutorials.</span>
                </h2>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-lg text-zinc-400 max-w-md leading-relaxed">
                  Access elite project blueprints detailing real-world microservices, vector databases, and system architectures designed for 2026+ hiring.
                </p>
              </Reveal>
              <Reveal delay={300}>
                <ul className="space-y-3 pt-4">
                  <li className="flex items-center gap-3 text-sm text-zinc-300"><Zap className="w-4 h-4 text-purple-400"/> Downloadable PDF system architecture guides.</li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300"><Zap className="w-4 h-4 text-purple-400"/> RAG AI vector databases & interview playbooks.</li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300"><Zap className="w-4 h-4 text-purple-400"/> Zero academic fluff or outdated exam material.</li>
                </ul>
              </Reveal>
            </div>
          </div>
        </section>
```
        {/* ========================================================= */}
        {/* FEATURE 4: CREATOR STUDIO - Minimal & Bold                 */}
        {/* ========================================================= */}
        <section className="relative py-20 lg:py-32 px-6 border-t border-white/5">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4">
                <BadgeCheck className="w-3.5 h-3.5" /> Creator Studio
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter leading-none">
                Your stage. <br/> <span className="bg-gradient-to-r from-rose-400 to-orange-500 bg-clip-text text-transparent">Your audience.</span>
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                A dedicated publishing environment for engineers to share peer-reviewed study guides, algorithm breakdowns, and project blueprints.
              </p>
            </Reveal>
            
            {/* Floating UI Mockup */}
            <Reveal delay={300}>
              <div className="relative mt-16 w-full max-w-5xl mx-auto rounded-t-2xl overflow-hidden border-t border-x border-white/10 border-b-0 bg-transparent p-2 md:p-4 pb-0">
                <div 
                  className="w-full relative"
                  style={maskStyles.fadeBottom}
                >
                  <Image 
                    src="/Features/Editor.png" 
                    alt="DSA Quest Creator Studio Publishing Environment" 
                    width={1920}
                    height={1080}
                    quality={100}
                    unoptimized
                    className="w-full h-auto rounded-t-xl object-contain hover:scale-[1.01] transition-transform duration-500" 
                    priority
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ========================================================= */}
        {/* FINAL CTA - Clean & Direct                                 */}
        {/* ========================================================= */}
        <section className="relative py-24 lg:py-40 px-6">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-[0.08] pointer-events-none" style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)', filter: 'blur(100px)' }}></div>
          
          <Reveal className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-5xl md:text-6xl font-medium tracking-tighter leading-tight">
              Ready to upgrade <br/> your preparation?
            </h2>
            <p className="text-lg text-zinc-400">
              Completely free, forever. Start tracking live contests today.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/contests" className="px-8 py-4 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:scale-105 transition-transform flex items-center gap-2 shadow-2xl">
                <Zap className="w-4 h-4" /> Start Tracking
              </Link>
            </div>
          </Reveal>
        </section>

      </main>

     
    </div>
  );
}
