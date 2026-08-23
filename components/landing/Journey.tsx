import React from 'react';
import Image from 'next/image';
import { Sprout, Check, Trophy, FolderGit2, NotebookPen, Map, Hammer, Rocket } from 'lucide-react';

export default function Journey() {
  return (
    <section id="journey" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top right, rgba(6,78,59,0.15), #09090b 60%)' }}></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20 scroll-reveal">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3 block">The Engineering Journey</span>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-4">Master the chaos.</h2>
          <p className="text-sm text-zinc-500 max-w-lg mx-auto">From confused first-year to an industry-ready engineer. ErithX provides the exact resources for every step.</p>
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
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-4">Mastering the Fundamentals</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Master core CS fundamentals with high-signal, zero-fluff study materials. We give you instant access to clean notes and architecture guides so you save hours for real-world coding.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Core CS Engineering PDFs</div>
                    <div className="text-xs text-zinc-500">Download high-yield guides for core fundamentals like OS, DBMS, System Design, and Networks.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Verified Interview Patterns</div>
                    <div className="text-xs text-zinc-500">Practice top recurring algorithmic patterns and company hiring problem breakdowns.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Clear Career Foundations</div>
                    <div className="text-xs text-zinc-500">Understand the modern tech landscape early with zero-noise guidance.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center scroll-reveal">
            <div>
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-4">Executing the Roadmaps</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                When it&apos;s time to build, you need solid project guidelines and highly accurate 2026 career roadmaps. Access elite blueprints to architect systems that recruiters actually care about.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="glass rounded-xl p-4">
                  <Map className="w-5 h-5 text-yellow-500 mb-2" />
                  <div className="text-sm font-medium">Tech Roadmaps</div>
                  <div className="text-[10px] text-zinc-500">2026 aligned paths</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <FolderGit2 className="w-5 h-5 text-cyan-400 mb-2" />
                  <div className="text-sm font-medium">Project Guides</div>
                  <div className="text-[10px] text-zinc-500">Elite architecture PDFs</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <NotebookPen className="w-5 h-5 text-orange-400 mb-2" />
                  <div className="text-sm font-medium">Smart Insights</div>
                  <div className="text-[10px] text-zinc-500">Career advice you can trust</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <Trophy className="w-5 h-5 text-purple-400 mb-2" />
                  <div className="text-sm font-medium">Contest Prep</div>
                  <div className="text-[10px] text-zinc-500">Ready your CP skills</div>
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
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-4">Dominating the Contests</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                When you&apos;re ready for competitive programming and interviews, our global contest calendar alerts you before every LeetCode, Codeforces, and CodeChef round. Never miss the arena.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Global Contest Calendar 2026</div>
                    <div className="text-xs text-zinc-500">Live tracker and alerts for all major coding challenges worldwide.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Real interview experiences</div>
                    <div className="text-xs text-zinc-500">From SDEs at Google, Microsoft, Amazon — verified, not vague.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Community support</div>
                    <div className="text-xs text-zinc-500">4,800+ students walking the same path. You&apos;re not alone.</div>
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
