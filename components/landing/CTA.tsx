import React from 'react';
import { Rocket, Zap, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import AuthCTAButton from './AuthCTAButton';

export default function CTA() {
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
                Join 2,400+ engineering students using ErithX to turn random grinding into focused progress. Free to start, with optional premium features coming soon.
              </p>

              <AuthCTAButton className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-all whitespace-nowrap mb-6 mx-auto">
                <Zap className="w-4 h-4" />
                Begin my ErithX review
              </AuthCTAButton>


              <div className="flex items-center justify-center gap-6 flex-wrap">
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  No spam, ever
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Unsubscribe anytime
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Built by a solo dev grinding SDE interviews
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
