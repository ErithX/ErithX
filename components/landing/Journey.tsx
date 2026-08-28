import React from 'react';
import Image from 'next/image';
import { Sprout, Check, Trophy, FolderGit2, NotebookPen, Map, Hammer, Rocket } from 'lucide-react';

export default function Journey() {
  return (
    <section id="journey" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top right, rgba(6,78,59,0.15), #09090b 60%)' }}></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20 scroll-reveal">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3 block">The engineering journey</span>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-4">From confused first‑year to industry‑ready.</h2>
          <p className="text-sm text-zinc-500 max-w-lg mx-auto">ErithX grows with you. Whether you’re just starting or grinding for interviews, your weekly review adapts to your stage and goals.</p>
        </div>

        {/* Journey stages */}
        <div className="space-y-20">
          
            {/* Stage 1 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center scroll-reveal">
            <div className="relative order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden border border-white/5 relative h-[400px]">
                <Image src="/landing/journey-stage-1.avif" fill className="object-cover" alt="Student studying fundamental computer science concepts" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-2">
                    <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Step 01: Fundamentals</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-4">Fundamentals</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Use curated articles and early habit tracking to build consistency without burnout.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Curated Articles</div>
                    <div className="text-xs text-zinc-500">Focus on what matters for the 2026 market.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Early Habit Tracking</div>
                    <div className="text-xs text-zinc-500">Build long-term consistency gradually, without overwhelming streaks.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center scroll-reveal">
            <div>
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-4">Projects & roadmaps</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Follow focused guides and let the system check whether your projects match your target role.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="glass rounded-xl p-4">
                  <Map className="w-5 h-5 text-yellow-500 mb-2" />
                  <div className="text-sm font-medium">Tech Roadmaps</div>
                  <div className="text-[10px] text-zinc-500">2026 aligned paths</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <FolderGit2 className="w-5 h-5 text-cyan-400 mb-2" />
                  <div className="text-sm font-medium">Project Goals</div>
                  <div className="text-[10px] text-zinc-500">Align with your targets</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <NotebookPen className="w-5 h-5 text-orange-400 mb-2" />
                  <div className="text-sm font-medium">Smart Insights</div>
                  <div className="text-[10px] text-zinc-500">Career advice you can trust</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-white/5 relative h-[400px]">
                <Image src="/landing/journey-stage-2.avif" fill className="object-cover" alt="Software engineer architecting a project system design" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-2">
                    <Hammer className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">Step 02: Systems & Blueprints</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center scroll-reveal">
            <div className="relative order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden border border-white/5 relative h-[400px]">
                <Image src="/landing/journey-stage-3.avif" fill className="object-cover" alt="Competitive programmer tracking and participating in coding contests" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-2">
                    <Rocket className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">Step 03: Arena Mastery</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-4">Contests & interviews</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Use the global contest calendar and interview insights. Your weekly review analyzes contest behavior and problem mix so you don’t just participate—you improve.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Analyze Contest Behavior</div>
                    <div className="text-xs text-zinc-500">See your real improvement over time, not just participation.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Global Contest Calendar</div>
                    <div className="text-xs text-zinc-500">Never miss the arena with reminders for major coding challenges worldwide.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
