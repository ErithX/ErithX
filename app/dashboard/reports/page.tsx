"use client";

import React, { useState } from 'react';
import { Search, MoreHorizontal, ShieldAlert, Lock, Sparkles, X } from 'lucide-react';

const DesktopTimeline = () => (
  <nav className="timeline-nav hidden xl:flex flex-col items-center justify-between">
    <div className="timeline-line"></div>
    <button className="text-zinc-500 hover:text-white transition-colors mb-4 z-10 bg-[#09090b] p-1 rounded-full" title="Search Custom Date">
      <Search className="w-4 h-4" />
    </button>
    <div className="flex flex-col gap-6 items-center bg-[#09090b] py-4 px-1 rounded-full">
      <div className="timeline-dot active"><div className="timeline-tooltip">Week 24 (Current)</div></div>
      <div className="timeline-dot"><div className="timeline-tooltip">Week 23: +12% Growth</div></div>
      <div className="timeline-dot"><div className="timeline-tooltip">Week 22: Graphs Mastered</div></div>
      <div className="timeline-dot missed"><div className="timeline-tooltip">Week 21: Missed (0 Problems)</div></div>
      <div class="timeline-dot"><div className="timeline-tooltip">Week 20: Started Strong</div></div>
    </div>
    <button className="text-zinc-600 hover:text-zinc-400 transition-colors mt-4 z-10 bg-[#09090b] p-1 rounded-full" title="Report Settings">
      <MoreHorizontal className="w-4 h-4" />
    </button>
  </nav>
);

const DesktopWarning = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside className="right-warning hidden xl:block">
      <div className="glass border-red-500/20 bg-red-500/5 rounded-xl p-5 flex flex-col gap-3 relative group transition-all">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-red-400/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <div className="flex items-center gap-3 pr-4">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <h4 className="text-xs font-medium text-red-300">Review Privilege At Risk</h4>
        </div>
        <p className="text-[11px] text-red-400/70 leading-relaxed">
          System detected brute-force submissions. Continued deviation will result in suspension of AI Review privileges for Week 25.
        </p>
      </div>
    </aside>
  );
};

const MobileTimeline = () => (
  <div className="xl:hidden mb-8">
    <div className="flex justify-between items-center mb-4">
      <span className="text-[10px] uppercase tracking-widest text-zinc-500">History</span>
      <button className="text-zinc-500 hover:text-white transition-colors p-1 rounded-full border border-white/5">
        <Search className="w-3.5 h-3.5" />
      </button>
    </div>
    <div className="mobile-timeline">
      <div className="mobile-dot active"></div>
      <div className="mobile-dot"></div>
      <div className="mobile-dot"></div>
      <div className="mobile-dot missed"></div>
      <div className="mobile-dot"></div>
      <div className="mobile-dot"></div>
      <div className="mobile-dot"></div>
    </div>
  </div>
);

const ReportHeader = () => (
  <header className="border-b border-white/5 pb-10 mb-12">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-10">
      <div>
        <div className="text-xs text-zinc-500 mb-2 tracking-wide">Week 24 Report</div>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-white">Momentum & Mastery</h1>
      </div>
      <div className="flex flex-col items-start md:items-end">
        <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1">Global Percentile</div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl md:text-5xl font-light bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Top 3</span>
          <span className="text-xl md:text-2xl font-light text-zinc-400">%</span>
        </div>
        <div className="text-[10px] text-zinc-600 mt-1">Out of 48,210 active peers</div>
      </div>
    </div>
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] uppercase tracking-widest text-zinc-500">8-Week Consistency</span>
        <span className="text-[10px] text-zinc-400 font-medium">6 weeks active</span>
      </div>
      <div className="grid grid-cols-8 gap-1.5 md:gap-2">
        <div className="momentum-seg active"></div>
        <div className="momentum-seg active"></div>
        <div className="momentum-seg"></div>
        <div className="momentum-seg active"></div>
        <div class="momentum-seg active"></div>
        <div className="momentum-seg active"></div>
        <div className="momentum-seg active"></div>
        <div className="momentum-seg active"></div>
      </div>
    </div>
  </header>
);

const MobileWarning = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="xl:hidden mb-12">
      <div className="glass border-red-500/20 bg-red-500/5 rounded-xl p-4 flex items-start gap-3 relative">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-red-400/50 hover:text-red-400 transition-opacity p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <ShieldAlert className="w-4 h-4 text-red-400" />
        </div>
        <div className="pr-4">
          <h4 className="text-xs font-medium text-red-300 mb-1">Review Privilege At Risk</h4>
          <p className="text-[11px] text-red-400/70 leading-relaxed">
            System detected brute-force submissions. Continued deviation will result in suspension of AI Review privileges.
          </p>
        </div>
      </div>
    </div>
  );
};

const ReportBody = () => (
  <article className="reading-text mb-16">
    <p>
      This week marked a distinct shift in your approach. Instead of defaulting to brute-force solutions, you began pausing to identify underlying patterns before writing a single line of code. This hesitation cost you time in the short term, but it is the exact friction required to transition from a pattern-matcher to a problem-solver. Your acceptance rate on medium-difficulty graph problems improved by 18%.
    </p>
    <p>
      However, friction remains in your execution of Dynamic Programming. You correctly identified the overlapping subproblems in the "Minimum Path Sum" grid, but your recurrence relation attempt failed to account for negative edge cases. This is a common trap: optimizing for the happy path while ignoring the boundaries. The goal isn't to write the optimal solution immediately, but to write the naive recursive solution first, prove its correctness, and only then apply memoization.
    </p>
    <p>
      Your debugging syntax improved significantly. You spent an average of 14 minutes debugging failed submissions this week, down from 32 minutes last week. You stopped relying on print statements and began using the step-through debugger to inspect state transitions. This is a massive leverage point. Moving forward, this efficiency will compound, allowing you to attempt one extra problem per session without extending your screen time.
    </p>
    <p>
      You are currently operating in the top 3% of the platform. But percentiles are a lagging indicator. The leading indicator is the quality of your thought process, which is becoming noticeably more structured and deliberate. Keep the friction. It is working.
    </p>
  </article>
);

const NextStepsPremium = () => (
  <section className="border-t border-white/5 pt-10">
    <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 mb-6">Your Next Move</div>
    <div className="glass rounded-xl p-6 md:p-8 relative overflow-hidden transition-all min-h-[220px]">
      <div className="blur-premium">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <h3 className="text-lg font-medium text-white">Focus Area: DP State Transitions</h3>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">Target: 3 Problems</span>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed mb-8 max-w-xl">
          Stop trying to write the optimized solution first. For the next three DP problems, write the brute-force recursive tree on paper, take a photo, and attach it to your submission notes. Only then proceed to code the top-down approach.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white text-zinc-900 text-xs font-semibold hover:bg-zinc-200 transition-all">
            Start Target Practice
          </button>
        </div>
      </div>
      <div className="absolute inset-0 premium-overlay flex flex-col items-center justify-center text-center p-8 z-10">
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <Lock className="w-5 h-5 text-zinc-400" />
        </div>
        <h4 className="text-base font-medium text-white mb-2">Unlock Your Optimized Path</h4>
        <p className="text-xs text-zinc-500 max-w-xs mb-5">
          Upgrade to Premium to reveal AI-curated next steps, custom problem sets, and targeted roadmaps based on this report.
        </p>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-900 text-xs font-bold hover:opacity-90 transition-all">
          <Sparkles className="w-3.5 h-3.5" />
          Unlock Premium
        </button>
      </div>
    </div>
  </section>
);

export default function ReviewPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-zinc-800 selection:text-white font-sans grid-bg relative overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        .aurora-bg {
          position: fixed; top: -10%; left: 20%; width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(16,185,129,0.15), transparent 70%);
          filter: blur(80px); z-index: 0; pointer-events: none;
        }
        .aurora-bg-2 {
          position: fixed; bottom: -10%; right: -10%; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(34,211,238,0.12), transparent 70%);
          filter: blur(80px); z-index: 0; pointer-events: none;
        }
        .glass { 
          background: rgba(9,9,11,0.6); backdrop-filter: blur(16px); 
          -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.08); 
        }
        .glass:hover { background: rgba(9,9,11,0.7); }
        .grid-bg { 
          background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); 
          background-size: 32px 32px; z-index: 0; position: relative;
        }
        .timeline-nav {
          position: fixed; left: 80px; top: 50%; transform: translateY(-50%);
          height: 60vh; z-index: 50;
        }
        .timeline-line {
          position: absolute; top: 0; bottom: 0; left: 50%;
          width: 1px; background: rgba(255,255,255,0.1);
          transform: translateX(-50%); z-index: -1;
        }
        .timeline-dot {
          width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.2);
          border: 2px solid #09090b; cursor: pointer; transition: all 0.2s ease; position: relative;
        }
        .timeline-dot:hover { background: #34d399; transform: scale(1.4); box-shadow: 0 0 12px rgba(16,185,129,0.6); }
        .timeline-dot.active { background: #10b981; transform: scale(1.6); box-shadow: 0 0 16px rgba(16,185,129,0.8); }
        .timeline-dot.missed { background: rgba(239, 68, 68, 0.4); border-color: rgba(239, 68, 68, 0.2); }
        .timeline-tooltip {
          position: absolute; left: 24px; top: 50%; transform: translateY(-50%);
          background: #18181b; border: 1px solid rgba(255,255,255,0.1);
          padding: 6px 12px; border-radius: 6px; font-size: 10px;
          white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s ease;
        }
        .timeline-dot:hover .timeline-tooltip { opacity: 1; }
        .mobile-timeline {
          display: flex; align-items: center; gap: 16px; overflow-x: auto;
          padding-bottom: 12px; scrollbar-width: none;
        }
        .mobile-timeline::-webkit-scrollbar { display: none; }
        .mobile-dot {
          width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.2);
          border: 2px solid #09090b; flex-shrink: 0;
        }
        .mobile-dot.active { background: #10b981; box-shadow: 0 0 10px rgba(16,185,129,0.6); }
        .mobile-dot.missed { background: rgba(239, 68, 68, 0.4); }
        .momentum-seg {
          height: 6px; border-radius: 3px; background: rgba(255,255,255,0.05); transition: all 0.3s ease;
        }
        .momentum-seg.active {
          background: linear-gradient(to right, #10b981, #34d399);
          box-shadow: 0 0 12px rgba(16,185,129,0.4);
        }
        .reading-text p {
          margin-bottom: 1.75rem; line-height: 1.8; font-size: 1.0625rem;
          color: #d4d4d8; font-weight: 400; letter-spacing: -0.01em;
        }
        .reading-text p:first-child::first-letter { color: #fff; font-weight: 600; }
        .blur-premium { filter: blur(5px); pointer-events: none; user-select: none; }
        .premium-overlay { background: rgba(9,9,11,0.4); backdrop-filter: blur(8px); }
        .right-warning {
          position: fixed; right: 32px; bottom: 32px; width: 240px; z-index: 40;
        }
        @media (max-width: 1279px) { .right-warning { display: none; } }
      `}} />

      {/* Aurora Backgrounds */}
      <div className="aurora-bg"></div>
      <div className="aurora-bg-2"></div>

      <DesktopTimeline />
      <DesktopWarning />

      {/* MAIN CONTENT */}
      <main className="relative pt-8 md:pt-12 pb-20 z-10">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <MobileTimeline />
          <ReportHeader />
          <MobileWarning />
          <ReportBody />
          <NextStepsPremium />
        </div>
      </main>
    </div>
  );
}
