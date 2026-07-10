import React from 'react';
import { Sprout, Check, Trophy, FolderGit2, NotebookPen, TrendingUp, Hammer, Rocket } from 'lucide-react';

export default function Journey() {
  return (
    <section id="journey" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top right, rgba(6,78,59,0.15), #09090b 60%)' }}></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20 scroll-reveal">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3 block">The Student Journey</span>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-4">From lost to landed.</h2>
          <p className="text-sm text-zinc-500 max-w-lg mx-auto">Every CS student&apos;s path is different. Here&apos;s how DSA Quest walks each phase with you.</p>
        </div>

        {/* Journey stages */}
        <div className="space-y-20">
          
          {/* Stage 1 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center scroll-reveal">
            <div className="relative order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden border border-white/5 relative">
                <img src="https://picsum.photos/seed/journey1/700/500.jpg" className="w-full h-[400px] object-cover" alt="First year" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-2">
                    <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Phase 01</span>
                  </div>
                </div>
              </div>
              {/* Floating stat */}
              <div className="absolute -bottom-6 -right-6 glass rounded-xl p-4 float-anim hidden md:block">
                <div className="text-2xl font-semibold text-emerald-400">Day 1</div>
                <div className="text-[10px] text-zinc-500">Your era begins</div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-4">The Awakening</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                First year. You don&apos;t know what you don&apos;t know. DSA Quest gives you the bird&apos;s-eye view — what matters, what doesn&apos;t, and where to actually spend your energy.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Discover the ecosystem</div>
                    <div className="text-xs text-zinc-500">Understand contests, platforms, and what recruiters actually look for.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Pick your first roadmap</div>
                    <div className="text-xs text-zinc-500">Modern, AI-aligned paths — not outdated 2015 tutorials.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Set up your alerts</div>
                    <div className="text-xs text-zinc-500">Never miss the contests that matter to your level.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center scroll-reveal">
            <div>
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-4">The Build Phase</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Second and third year. The grind is real, but it doesn&apos;t have to break you. Track contests, ship projects, and build the portfolio that makes recruiters slide into your DMs.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="glass rounded-xl p-4">
                  <Trophy className="w-5 h-5 text-yellow-500 mb-2" />
                  <div className="text-sm font-medium">Contest tracker</div>
                  <div className="text-[10px] text-zinc-500">10+ platforms, one view</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <FolderGit2 className="w-5 h-5 text-cyan-400 mb-2" />
                  <div className="text-sm font-medium">Project monitor</div>
                  <div className="text-[10px] text-zinc-500">Idea to deployment</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <NotebookPen className="w-5 h-5 text-orange-400 mb-2" />
                  <div className="text-sm font-medium">Smart notes</div>
                  <div className="text-[10px] text-zinc-500">By toppers, for you</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <TrendingUp className="w-5 h-5 text-purple-400 mb-2" />
                  <div className="text-sm font-medium">Progress review</div>
                  <div className="text-[10px] text-zinc-500">Weekly check-ins</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-white/5 relative">
                <img src="https://picsum.photos/seed/journey2/700/500.jpg" className="w-full h-[400px] object-cover" alt="Build phase" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-2">
                    <Hammer className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">Phase 02</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 glass rounded-xl p-4 float-anim-delay hidden md:block">
                <div className="text-2xl font-semibold text-cyan-400">14</div>
                <div className="text-[10px] text-zinc-500">Projects shipped</div>
              </div>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center scroll-reveal">
            <div className="relative order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden border border-white/5 relative">
                <img src="https://picsum.photos/seed/journey3/700/500.jpg" className="w-full h-[400px] object-cover" alt="Landing phase" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-2">
                    <Rocket className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">Phase 03</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 glass rounded-xl p-4 float-anim hidden md:block">
                <div className="text-2xl font-semibold text-purple-400">₹42 LPA</div>
                <div className="text-[10px] text-zinc-500">Avg. package</div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-4">The Landing</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Final year. Interview prep, milestone flexing, and the community that has your back when anxiety hits. DSA Quest makes sure you walk in ready — not rattled.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Verifiable milestone cards</div>
                    <div className="text-xs text-zinc-500">Share proof of consistency directly to LinkedIn.</div>
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
