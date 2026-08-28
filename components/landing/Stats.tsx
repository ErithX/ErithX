import React from 'react';

export default function Stats() {
  return (
    <section className="py-20 px-6 border-y border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3 block">By The Numbers</span>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter">Built by students. Trusted by thousands.</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="scroll-reveal">
            <div className="text-5xl font-semibold mb-2 gradient-text-hero">2.4K+</div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-500">Active Students</div>
          </div>
          <div className="scroll-reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="text-5xl font-semibold mb-2 text-emerald-400">10+</div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-500">Platforms Tracked</div>
          </div>
          <div className="scroll-reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="text-5xl font-semibold mb-2 text-cyan-400">Weekly</div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-500">Performance Reviews</div>
          </div>
          <div className="scroll-reveal" style={{ transitionDelay: '0.3s' }}>
            <div className="text-5xl font-semibold mb-2 text-purple-400">Free</div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-500">To Start</div>
          </div>
        </div>
      </div>
    </section>
  );
}
