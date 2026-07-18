import React from 'react';
import { Bell, CalendarCheck, Filter, BookCopy, Download, BadgeCheck, Library, Users, Layers } from 'lucide-react';

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 scroll-reveal">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3 block">The Complete Resource Vault</span>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-4">Everything in one place.<br /><span className="text-zinc-500">Zero fluff.</span></h2>
          <p className="text-sm text-zinc-500 max-w-xl mx-auto">The premier collection of contest trackers, semester study materials, engineering PDFs, and precise tech roadmaps. Built for modern engineers.</p>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-6 gap-5 auto-rows-[220px]">

          {/* Card 1: Contest Tracker (Large) */}
          <div className="bento-card md:col-span-4 rounded-2xl overflow-hidden relative group border border-white/5">
            <img src="landing/banner1.avif" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" alt="Contest Tracker" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>
            <div className="relative z-10 p-7 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="relative flex h-2 w-2">
                    <span className="live-pulse absolute inline-flex h-full w-full rounded-full bg-red-500"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">Ultimate Contest Calendar</span>
                </div>
                <h3 className="text-2xl font-medium tracking-tight mb-2">Never miss a coding contest</h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-md">Track global competitive programming events across LeetCode, Codeforces, CodeChef, and 10+ platforms. Integrated timezone support and direct registration links.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] text-zinc-400">Set your reminders</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CalendarCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] text-zinc-400">Timezone smart</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[10px] text-zinc-400">Filter by platform</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Milestone Cards -> High-Quality Free PDF Notes */}
          <div className="bento-card md:col-span-2 rounded-2xl overflow-hidden relative group border border-white/5">
            <img src="landing/study notes.jpg" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" alt="Premium PDFs" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent"></div>
            <div className="relative z-10 p-5 h-full flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-2">
                  <BookCopy className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-[17px] font-medium mb-1">Premium Free PDFs</h3>
                <p className="text-[11px] text-zinc-400 leading-tight">High-quality, meticulously structured B.Tech notes. Stop searching Google.</p>
              </div>
              {/* Mini preview */}
              <div className="glass rounded-lg p-2.5 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <Download className="w-3 h-3 text-yellow-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold truncate">OS & DBMS Notes</div>
                    <div className="text-[8px] text-zinc-500">Instant PDF Access</div>
                  </div>
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Notes Hub (Image) */}
          <div className="bento-card md:col-span-2 rounded-2xl overflow-hidden relative group border border-white/5">
            <img src="/landing/PlatformMarquee.avif" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500" alt="Notes Hub" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-end">
              <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center mb-3">
                <Library className="w-4 h-4 text-orange-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">B.Tech PYQs Archive</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">Previous year question papers, sorted by semester and university.</p>
            </div>
          </div>

          {/* Card 4: Project Monitor -> Elite Project Roadmaps */}
          <div className="bento-card md:col-span-4 rounded-2xl overflow-hidden relative group border border-white/5">
            <img src="landing/ChatGPT Image Jul 18, 2026, 09_30_44 PM.png" className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-35 transition-opacity" alt="Project Monitor" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent"></div>
            <div className="relative z-10 p-7 h-full flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-3 block">Project Architecture Guides</span>
                <h3 className="text-2xl font-medium tracking-tight mb-2">Build products, not tutorials.</h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-md">Access elite project guidelines that explain exactly how to architect AI applications, distributed systems, and real-time backend services for your portfolio.</p>
              </div>
              {/* Roadmap progress bar style */}
              <div className="space-y-2 max-w-sm">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-zinc-400">Microservices System Blueprint</span>
                    <span className="text-[10px] text-emerald-400 font-medium">Free PDF</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-zinc-400">RAG AI Application Guide</span>
                    <span className="text-[10px] text-cyan-400 font-medium">Available</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Community */}
          <div className="bento-card md:col-span-2 rounded-2xl overflow-hidden relative group border border-white/5">
            <img src="https://picsum.photos/seed/bento5/400/400.jpg" className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-500" alt="Community" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-end">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center mb-3">
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">High-Intent Forum</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">Pure engineering strategy. No low-effort lifestyle vloggers allowed.</p>
              <div className="flex -space-x-2">
                <img src="https://picsum.photos/seed/comm1/32/32.jpg" className="w-6 h-6 rounded-full border-2 border-zinc-950 object-cover" alt="Community" />
                <img src="https://picsum.photos/seed/comm2/32/32.jpg" className="w-6 h-6 rounded-full border-2 border-zinc-950 object-cover" alt="Community" />
                <img src="https://picsum.photos/seed/comm3/32/32.jpg" className="w-6 h-6 rounded-full border-2 border-zinc-950 object-cover" alt="Community" />
                <div className="w-6 h-6 rounded-full border-2 border-zinc-950 bg-white/5 flex items-center justify-center">
                  <span className="text-[8px] text-zinc-400 font-medium">+86</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 6: Roadmaps */}
          <div className="bento-card md:col-span-3 rounded-2xl overflow-hidden relative group border border-white/5">
            <img src="https://picsum.photos/seed/bento6/600/400.jpg" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" alt="Roadmaps" />
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950/80 to-transparent"></div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3 block">Tech Career Roadmaps 2026</span>
                <h3 className="text-xl font-medium mb-2">Built for the modern market</h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">Trendy tech stacks, genuine career advice, and high-quality study materials that match what top companies actually expect today.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-zinc-400">#ai-engineering</div>
                <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-zinc-400">#system-design</div>
                <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-zinc-400">#web3</div>
              </div>
            </div>
          </div>

          {/* Card 7: Personal Monitor -> Elite Study Materials */}
          <div className="bento-card md:col-span-3 rounded-2xl overflow-hidden relative group border border-white/5">
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top right, rgba(168,85,247,0.1), transparent 70%)' }}></div>
            <div className="relative z-10 p-5 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-purple-400">Resource Database</span>
                </div>
                <h3 className="text-lg font-medium mb-1.5">Everything you need.</h3>
                <p className="text-[11px] text-zinc-400 leading-tight max-w-xs line-clamp-2">Direct access to a vast, constantly updated repository of university notes, technical interview breakdowns, and algorithmic cheatsheets.</p>
              </div>
              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-1.5 mt-2">
                <div className="glass rounded-lg p-1.5 text-center">
                  <div className="text-sm font-semibold text-emerald-400">100+</div>
                  <div className="text-[8px] text-zinc-500">Free PDFs</div>
                </div>
                <div className="glass rounded-lg p-1.5 text-center">
                  <div className="text-sm font-semibold text-cyan-400">20+</div>
                  <div className="text-[8px] text-zinc-500">Roadmaps</div>
                </div>
                <div className="glass rounded-lg p-1.5 text-center">
                  <div className="text-sm font-semibold text-purple-400">A+</div>
                  <div className="text-[8px] text-zinc-500">Quality Notes</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
