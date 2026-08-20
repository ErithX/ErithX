"use client";

import React, { useState } from 'react';
import { Check, Sparkles, X, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function PricingClient() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <>
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
          background: rgba(9,9,11,0.6); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .grid-bg {
          background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 32px 32px; z-index: 0; position: relative;
        }
        .pro-glow {
          border: 1px solid rgba(16,185,129,0.3);
          box-shadow: 0 0 40px rgba(16,185,129,0.1), inset 0 0 20px rgba(16,185,129,0.05);
        }
        .toggle-container {
          width: 220px; height: 40px; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 999px;
          position: relative; cursor: pointer; transition: all 0.3s ease;
        }
        .toggle-pill {
          position: absolute; top: 4px; left: 4px; width: 100px; height: 32px;
          background: rgba(255,255,255,0.1); border-radius: 999px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .toggle-container.active .toggle-pill { transform: translateX(116px); background: linear-gradient(to right, #10b981, #22d3ee); }
      `}} />

      {/* Monthly/Yearly Toggle */}
      <div className="flex justify-center mb-12">
        <div 
          className={`toggle-container flex items-center justify-between px-6 text-xs font-medium ${isYearly ? 'active' : ''} text-zinc-400`} 
          onClick={() => setIsYearly(!isYearly)}
        >
          <span className={`z-10 w-full text-center transition-colors ${!isYearly ? 'text-white' : ''}`}>Monthly</span>
          <span className={`z-10 w-full text-center transition-colors ${isYearly ? 'text-zinc-900 font-bold' : ''}`}>Yearly (Save 2mo)</span>
          <div className="toggle-pill"></div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-20">
        
        {/* FREE PLAN */}
        <div className="glass rounded-2xl p-8 flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-zinc-300 mb-2">Free</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-semibold">₹0</span>
              <span className="text-sm text-zinc-500">/ forever</span>
            </div>
            <p className="text-xs text-zinc-500">Best for: Students who want to try the system</p>
          </div>

          <Link href="/dashboard" className="w-full py-3 rounded-lg border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white/5 transition-all mb-8 flex items-center justify-center">
            Get Started
          </Link>

          <ul className="space-y-3 text-sm text-zinc-400">
            <li className="flex items-start gap-3"><Check className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" /> Weekly AI Mentor Review (limited)</li>
            <li className="flex items-start gap-3"><Check className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" /> Basic progress insights</li>
            <li className="flex items-start gap-3"><Check className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" /> Contest tracking</li>
            <li className="flex items-start gap-3"><Check className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" /> 160-character focus notes</li>
            <li className="flex items-start gap-3"><Check className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" /> Last 2 weeks of report history</li>
            <li className="flex items-start gap-3"><Check className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" /> Standard tone feedback</li>
          </ul>
        </div>

        {/* PRO PLAN */}
        <div className="glass pro-glow rounded-2xl p-8 flex flex-col relative overflow-hidden">
          {/* Recommended Badge */}
          <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-900 text-[10px] font-bold uppercase tracking-wider px-4 py-1 rounded-bl-lg">
            Recommended
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">Pro</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {isYearly ? '₹4,999' : '₹499'}
              </span>
              <span className="text-sm text-zinc-500">
                {isYearly ? '/ year' : '/ month'}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              {isYearly ? 'Best for: Students serious about consistent growth (Save 2 months!)' : 'Best for: Students serious about consistent growth'}
            </p>
          </div>

          <Link href="/dashboard" className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-900 text-sm font-bold hover:opacity-90 transition-all mb-8 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> Upgrade to Pro
          </Link>

          <ul className="space-y-3 text-sm text-zinc-300">
            <li className="flex items-start gap-3"><Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Unlimited AI Mentor Reviews</li>
            <li className="flex items-start gap-3"><Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Full direct & honest feedback</li>
            <li className="flex items-start gap-3"><Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> 600-character focus notes (higher priority)</li>
            <li className="flex items-start gap-3"><Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Complete report history</li>
            <li className="flex items-start gap-3"><Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Advanced progress analytics</li>
            <li className="flex items-start gap-3"><Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Career target personalization</li>
            <li className="flex items-start gap-3"><Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Priority processing</li>
            <li className="flex items-start gap-3"><Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Inactivity protection tools</li>
          </ul>
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <div className="hidden md:block glass rounded-2xl p-8 mb-20">
        <h3 className="text-lg font-medium mb-6 text-center text-zinc-300">Detailed Comparison</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {/* Header */}
          <div className="font-medium text-zinc-500 pb-4 border-b border-white/5">Feature</div>
          <div className="font-medium text-zinc-500 pb-4 border-b border-white/5 text-center">Free</div>
          <div className="font-medium text-emerald-400 pb-4 border-b border-white/5 text-center">Pro</div>
          
          {/* Rows */}
          <div className="py-3 border-b border-white/5 text-zinc-400">AI Mentor Reviews</div>
          <div className="py-3 border-b border-white/5 text-center text-zinc-400">Limited</div>
          <div className="py-3 border-b border-white/5 text-center text-white font-medium">Unlimited</div>

          <div className="py-3 border-b border-white/5 text-zinc-400">Feedback Style</div>
          <div className="py-3 border-b border-white/5 text-center text-zinc-400">Standard</div>
          <div className="py-3 border-b border-white/5 text-center text-white font-medium">Direct & Honest</div>

          <div className="py-3 border-b border-white/5 text-zinc-400">Focus Notes</div>
          <div className="py-3 border-b border-white/5 text-center text-zinc-400">160 chars</div>
          <div className="py-3 border-b border-white/5 text-center text-white font-medium">600 chars</div>

          <div className="py-3 border-b border-white/5 text-zinc-400">Report History</div>
          <div className="py-3 border-b border-white/5 text-center text-zinc-400">Last 2 weeks</div>
          <div className="py-3 border-b border-white/5 text-center text-white font-medium">Full history</div>

          <div className="py-3 border-b border-white/5 text-zinc-400">Career Target Personalization</div>
          <div className="py-3 border-b border-white/5 text-center text-zinc-400">Basic</div>
          <div className="py-3 border-b border-white/5 text-center text-white font-medium">Full</div>

          <div className="py-3 border-b border-white/5 text-zinc-400">Progress Analytics</div>
          <div className="py-3 border-b border-white/5 text-center text-zinc-400">Basic</div>
          <div className="py-3 border-b border-white/5 text-center text-white font-medium">Advanced</div>

          <div className="py-3 text-zinc-400">Priority Processing</div>
          <div className="py-3 text-center text-zinc-400 flex justify-center"><X className="w-4 h-4 inline-block text-zinc-600" /></div>
          <div className="py-3 text-center text-white font-medium flex justify-center"><Check className="w-4 h-4 inline-block text-emerald-400" /></div>
        </div>
      </div>

      {/* WHY PRO EXISTS */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="text-xl font-medium text-white mb-4">Why Pro exists</h2>
        <p className="text-sm text-zinc-400 leading-relaxed mb-3">
          Free helps you experience the system. Pro removes limits so the mentor can actually hold you accountable every week.
        </p>
        <p className="text-xs text-zinc-500 italic">Most students who stay consistent upgrade within the first month.</p>
      </div>

      {/* Trust Line */}
      <div className="flex items-center justify-center gap-2 text-xs text-zinc-600">
        <ShieldCheck className="w-3.5 h-3.5" />
        Cancel anytime, no questions asked.
      </div>
    </>
  );
}
