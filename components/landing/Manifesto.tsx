import React from 'react';
import Image from 'next/image';
import { Quote, HeartPulse, Sparkles, Target } from 'lucide-react';

export default function Manifesto() {
  return (
    <section id="manifesto" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(24,24,27,0.6), #09090b)' }}></div>
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)', filter: 'blur(80px)' }}></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Image */}
          <div className="lg:col-span-5 relative scroll-reveal">
            <div className="relative rounded-2xl overflow-hidden border border-white/5 h-[520px]">
              <Image src="/landing/manifesto-coder.avif" fill className="object-cover" alt="Student journey showing a coder focusing at night" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-cyan-950/10"></div>
              
              {/* Quote overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass rounded-xl p-5">
                  <Quote className="w-5 h-5 text-emerald-400 mb-2" />
                  <p className="text-xs text-zinc-300 leading-relaxed italic mb-3">
                    Grinding without intent is just exhaustion. We built DSA Quest for the student who wants to win without losing themselves.
                  </p>
                  <div className="flex items-center gap-2">
                    <Image src="https://picsum.photos/seed/founder/32/32.jpg" width={24} height={24} className="rounded-full object-cover" alt="DSA Quest Founder profile picture" />
                    <span className="text-[10px] text-zinc-500">DSA Quest Team</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border border-emerald-500/20 float-anim hidden lg:block"></div>
          </div>

          {/* Right: Manifesto text */}
          <div className="lg:col-span-7 scroll-reveal">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3 block">The Anti-Noise Philosophy</span>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-6 leading-[1.1]">
              Not another<br/>
              <span className="gradient-text">grind-set platform.</span>
            </h2>
            
            <div className="space-y-5 text-zinc-400 text-sm leading-relaxed">
              <p>
                The internet is full of bootcamps screaming &quot;100 days, 14 hours, no excuses.&quot; That&apos;s not education. That&apos;s burnout disguised as discipline.
              </p>
              <p>
                DSA Quest exists because Gen Z engineering students deserve a platform that understands them — one that speaks to their emotion, their ambition, their real pain points. Not a sterile portal built by people who forgot what being a student feels like.
              </p>
              <p className="text-white font-medium">
                We focus on preparation with enjoyment, passion, and intent. Not rote grinding. Not guilt-driven streaks. Just a system that makes winning feel inevitable.
              </p>
            </div>

            {/* Pillars */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              <div className="glass rounded-xl p-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                  <HeartPulse className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xs font-medium mb-1">Intent over volume</div>
                <div className="text-[10px] text-zinc-500 leading-relaxed">2 hours of focus beats 10 hours of doom-scrolling tabs.</div>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-xs font-medium mb-1">Joy over guilt</div>
                <div className="text-[10px] text-zinc-500 leading-relaxed">Celebrate progress. Stop punishing yourself for missing a day.</div>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
                  <Target className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xs font-medium mb-1">Clarity over chaos</div>
                <div className="text-[10px] text-zinc-500 leading-relaxed">Know what to do next, always. No more 50-tab confusion.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
