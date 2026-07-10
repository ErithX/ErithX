import React from 'react';
import { Bell, CalendarCheck, Filter, Award, BadgeCheck, BookOpen, Users, Activity } from 'lucide-react';

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 scroll-reveal">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3 block">The Complete Ecosystem</span>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-4">Everything in one place.<br/><span className="text-zinc-500">Finally.</span></h2>
          <p className="text-sm text-zinc-500 max-w-xl mx-auto">Five pillars built for CS engineering students — contests, notes, projects, community, and progress tracking. No more platform-hopping.</p>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-6 gap-5 auto-rows-[220px]">
          
          {/* Card 1: Contest Tracker (Large) */}
          <div className="bento-card md:col-span-4 rounded-2xl overflow-hidden relative group border border-white/5">
            <img src="https://picsum.photos/seed/bento1/800/400.jpg" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" alt="Contest Tracker" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>
            <div className="relative z-10 p-7 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="relative flex h-2 w-2">
                    <span className="live-pulse absolute inline-flex h-full w-full rounded-full bg-red-500"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">Live Contest Board</span>
                </div>
                <h3 className="text-2xl font-medium tracking-tight mb-2">Never miss another contest</h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-md">Track every contest, hackathon, and interview sprint across 10+ platforms. Get alerts 30 minutes before they begin — without spam.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] text-zinc-400">Instant alerts</span>
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

          {/* Card 2: Milestone Cards */}
          <div className="bento-card md:col-span-2 rounded-2xl overflow-hidden relative group border border-white/5" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.05))' }}>
            <div className="p-6 h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
                  <Award className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Milestone Cards</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Verifiable proof of your hustle. Share directly to LinkedIn.</p>
              </div>
              {/* Mini milestone preview */}
              <div className="glass rounded-lg p-3 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-semibold">47-Day Streak</div>
                    <div className="text-[9px] text-zinc-500">Verified achievement</div>
                  </div>
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Notes Hub (Image) */}
          <div className="bento-card md:col-span-2 rounded-2xl overflow-hidden relative group border border-white/5">
            <img src="https://picsum.photos/seed/bento3/400/400.jpg" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500" alt="Notes Hub" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-end">
              <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center mb-3">
                <BookOpen className="w-4 h-4 text-orange-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">Semester Notes</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">Curated by toppers. Updated for the AI era.</p>
            </div>
          </div>

          {/* Card 4: Project Monitor (Large) */}
          <div className="bento-card md:col-span-4 rounded-2xl overflow-hidden relative group border border-white/5">
            <img src="https://picsum.photos/seed/bento4/800/400.jpg" className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-35 transition-opacity" alt="Project Monitor" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent"></div>
            <div className="relative z-10 p-7 h-full flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-3 block">Project Monitor</span>
                <h3 className="text-2xl font-medium tracking-tight mb-2">Build, ship, showcase.</h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-md">Track your projects from idea to deployment. Get weekly check-ins, milestones, and a portfolio that actually impresses recruiters.</p>
              </div>
              {/* Project progress bar */}
              <div className="space-y-2 max-w-sm">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-zinc-400">AI Resume Analyzer</span>
                    <span className="text-[10px] text-emerald-400 font-medium">78%</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-zinc-400">Real-time Chat App</span>
                    <span className="text-[10px] text-cyan-400 font-medium">45%</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: '45%' }}></div>
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
              <h3 className="text-lg font-medium mb-1">Community</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">Backed by verified pros from Google, Microsoft, Amazon.</p>
              <div className="flex -space-x-2">
                <img src="https://picsum.photos/seed/comm1/32/32.jpg" className="w-6 h-6 rounded-full border-2 border-zinc-950 object-cover" alt="Community Member" />
                <img src="https://picsum.photos/seed/comm2/32/32.jpg" className="w-6 h-6 rounded-full border-2 border-zinc-950 object-cover" alt="Community Member" />
                <img src="https://picsum.photos/seed/comm3/32/32.jpg" className="w-6 h-6 rounded-full border-2 border-zinc-950 object-cover" alt="Community Member" />
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
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3 block">Modern Roadmaps</span>
                <h3 className="text-xl font-medium mb-2">Built for the AI era</h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">Trendy topics, AI-aligned paths, and skill tracks that match what companies actually hire for in 2026.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-zinc-400">#ai-ml</div>
                <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-zinc-400">#system-design</div>
                <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-zinc-400">#fullstack</div>
              </div>
            </div>
          </div>

          {/* Card 7: Personal Monitor */}
          <div className="bento-card md:col-span-3 rounded-2xl overflow-hidden relative group border border-white/5">
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top right, rgba(168,85,247,0.1), transparent 70%)' }}></div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Personal Monitor</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Your growth, quantified.</h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">Weekly progress reviews. Custom study suggestions based on your profile and goals.</p>
              </div>
              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="glass rounded-lg p-2 text-center">
                  <div className="text-base font-semibold text-emerald-400">+47%</div>
                  <div className="text-[9px] text-zinc-500">This week</div>
                </div>
                <div className="glass rounded-lg p-2 text-center">
                  <div className="text-base font-semibold text-cyan-400">312</div>
                  <div className="text-[9px] text-zinc-500">Problems</div>
                </div>
                <div className="glass rounded-lg p-2 text-center">
                  <div className="text-base font-semibold text-purple-400">A+</div>
                  <div className="text-[9px] text-zinc-500">Consistency</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
