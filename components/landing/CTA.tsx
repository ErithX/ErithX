"use client";

import React, { useState } from 'react';
import { Rocket, Mail, Zap, CheckCircle } from 'lucide-react';

export default function CTA() {
  const [email, setEmail] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setEmail('');
    }
  };

  return (
    <>
      <section id="join" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at bottom, rgba(6,78,59,0.2), #09090b 60%)' }}></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)', filter: 'blur(80px)' }}></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="glass rounded-3xl p-10 md:p-16 text-center relative overflow-hidden scroll-reveal">
            {/* Background image accent */}
            <img src="https://picsum.photos/seed/ctabg/1200/600.jpg" className="absolute inset-0 w-full h-full object-cover opacity-10" alt="" />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/90 to-zinc-950"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8">
                <Rocket className="w-7 h-7 text-emerald-400" />
              </div>

              <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-4 gradient-text-hero">
                Your era starts today.
              </h2>
              <p className="text-sm text-zinc-400 mb-10 max-w-md mx-auto">
                Join 2,400+ students who stopped grinding and started winning. Free, ad-free, forever.
              </p>

              {/* Newsletter form hidden for now
              <form onSubmit={handleJoin} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto mb-6">
                <div className="relative flex-1 w-full">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email" 
                    required 
                    placeholder="your@email.com" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-emerald-500/50 transition-colors" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-all whitespace-nowrap">
                  <Zap className="w-4 h-4" />
                  Begin My Quest
                </button>
              </form>
              */}

              <a href="/contests" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-all whitespace-nowrap mb-6 mx-auto">
                <Zap className="w-4 h-4" />
                Begin My Quest
              </a>


              <div className="flex items-center justify-center gap-6 flex-wrap">
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  No spam, ever
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Free forever
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Unsubscribe anytime
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in">
          <div className="px-4 py-3 rounded-xl backdrop-blur-md text-xs font-medium flex items-center gap-2 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-xl">
            <CheckCircle className="w-4 h-4" />
            Your era begins now.
          </div>
        </div>
      )}
    </>
  );
}
