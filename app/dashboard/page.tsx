"use client";

import React, { useState, useEffect } from 'react';
import { 
  Zap, Bell, Trophy, PenLine, FileText, Share2, 
  Image as ImageIcon, Sparkles, Link as LinkIcon, 
  Plus, BarChart3, BarChart2, Calendar, Activity, 
  CheckCircle, Flame, Medal 
} from 'lucide-react';
import AchievementCard, { CardType, CardLevel } from '@/components/AchievementCard';
import { createClient } from '@/app/lib/supabase/client';

const levelDescs: Record<CardLevel, string> = {
  bronze: 'The journey begins. 1 contest + 1 platform connected + 3-day streak.',
  silver: 'Not a one-day wonder. 7-day streak + 5 contests + 2 platforms.',
  gold: 'Genuine discipline. 30-day streak + 15 contests + 3 platforms + positive velocity.',
  platinum: 'Competitive performer. 60-day streak + 30 contests + top-10% finish + 3 platforms.',
  diamond: 'Top-tier + well-rounded. 100-day streak + Expert rating + 8/10 breadth + 4 platforms.',
  legendary: 'Exceptional. 365-day streak + mentoring 3 students + 10/10 breadth.'
};

const levels: CardLevel[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'legendary'];

export default function DashboardPage() {
  const [currentLevel, setCurrentLevel] = useState<CardLevel>('gold');
  const [currentType, setCurrentType] = useState<CardType>('transformation');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const cycleCardLevel = () => {
    const idx = levels.indexOf(currentLevel);
    setCurrentLevel(levels[(idx + 1) % levels.length]);
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#09090b]/90 backdrop-blur-[12px]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="font-semibold text-sm tracking-tight">DSA Quest</span>
            </a>
            <div className="hidden md:flex items-center gap-1">
              <a href="/dashboard" className="px-3 py-1.5 text-xs font-medium text-white bg-white/5 rounded">Dashboard</a>
              <a href="/" className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded">Contests</a>
              <a href="/resources" className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded">Resources</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-emerald-500 rounded-full animate-spin"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 cursor-pointer">
                  <img 
                    src={user.user_metadata?.avatar_url || "https://picsum.photos/seed/arjun-dash/32/32.jpg"} 
                    className="w-7 h-7 rounded-full object-cover border border-white/10" 
                    alt="Profile" 
                  />
                  <span className="text-xs font-medium hidden sm:inline text-zinc-300">
                    {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Coder'}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Greeting */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Coder'}
              </h1>
              <p className="text-sm text-zinc-500 mt-0.5">Your next milestone is closer than you think.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass">
                <span className="text-xl streak-fire">🔥</span>
                <div>
                  <div className="text-lg font-bold leading-none mono">23</div>
                  <div className="text-[9px] uppercase tracking-widest text-zinc-500">Day Streak</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-lg font-bold leading-none mono">2h 14m</div>
                  <div className="text-[9px] uppercase tracking-widest text-zinc-500">Next Contest</div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Card Section */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <Trophy className="w-3.5 h-3.5" /> Achievement Card
              </h2>
              <span className="text-[10px] text-zinc-600 mono">dsaquest.io/v/arjun-m</span>
            </div>

            {/* Card Type Tabs */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              {[
                { id: 'transformation', label: 'Transformation' },
                { id: 'consistency', label: 'Consistency' },
                { id: 'crossplatform', label: 'Cross-Platform' },
                { id: 'skillmap', label: 'Skill Map' },
                { id: 'milestone', label: 'Milestone' }
              ].map(t => (
                <button 
                  key={t.id}
                  className={`type-tab px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider text-zinc-400 border border-transparent hover:text-white transition-all ${currentType === t.id ? 'active' : ''}`}
                  onClick={() => setCurrentType(t.id as CardType)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Featured Card */}
              <div className="lg:col-span-3">
                <AchievementCard level={currentLevel} type={currentType} onCycleLevel={cycleCardLevel} />
                <p className="text-[10px] text-zinc-600 mt-2 text-center">Click card to cycle through levels</p>
              </div>

              {/* Level Selector + Card Collection */}
              <div className="lg:col-span-2 space-y-4">
                {/* Level Dots */}
                <div className="glass rounded-2xl p-5">
                  <div className="text-[9px] uppercase tracking-widest text-zinc-600 mb-3">Card Level</div>
                  <div className="flex items-center justify-between mb-4">
                    {[
                      { l: 'bronze', emoji: '🟤', color: 'text-amber-600' },
                      { l: 'silver', emoji: '🥈', color: 'text-gray-400' },
                      { l: 'gold', emoji: '🥇', color: 'text-yellow-500' },
                      { l: 'platinum', emoji: '💎', color: 'text-cyan-400' },
                      { l: 'diamond', emoji: '💠', color: 'text-purple-400' },
                      { l: 'legendary', emoji: '🏆', color: 'text-red-400' }
                    ].map(lvl => (
                      <div key={lvl.l} className={`level-dot flex flex-col items-center gap-1 ${currentLevel === lvl.l ? 'active' : ''}`} onClick={() => setCurrentLevel(lvl.l as CardLevel)}>
                        <div className={`w-10 h-10 hex hex-${lvl.l} flex items-center justify-center text-lg`}>{lvl.emoji}</div>
                        <span className={`text-[8px] font-bold uppercase tracking-wider ${lvl.color}`}>{lvl.l}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] text-zinc-500 leading-relaxed">
                    {levelDescs[currentLevel]}
                  </div>
                </div>

                {/* Unlock Progress */}
                <div className="glass rounded-2xl p-5">
                  <div className="text-[9px] uppercase tracking-widest text-zinc-600 mb-3">Next Unlock: 💎 Platinum</div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1"><span className="text-[10px] text-zinc-500">60-Day Streak</span><span className="text-[10px] mono text-zinc-400">23/60</span></div>
                      <div className="w-full h-1 rounded-full bg-zinc-800"><div className="h-full rounded-full bg-orange-500" style={{ width: '38%' }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1"><span className="text-[10px] text-zinc-500">30 Contests</span><span className="text-[10px] mono text-emerald-400">18/30 ✓</span></div>
                      <div className="w-full h-1 rounded-full bg-zinc-800"><div className="h-full rounded-full bg-emerald-500" style={{ width: '60%' }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1"><span className="text-[10px] text-zinc-500">Top 10% Finish</span><span className="text-[10px] mono text-zinc-600">—</span></div>
                      <div className="w-full h-1 rounded-full bg-zinc-800"><div className="h-full rounded-full bg-zinc-700" style={{ width: '0%' }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1"><span className="text-[10px] text-zinc-500">3+ Platforms</span><span className="text-[10px] mono text-emerald-400">3/3 ✓</span></div>
                      <div className="w-full h-1 rounded-full bg-zinc-800"><div className="h-full rounded-full bg-emerald-500" style={{ width: '100%' }}></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2/3 */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile + Contributions */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-6">
                  <img 
                    src={user?.user_metadata?.avatar_url || "https://picsum.photos/seed/arjun-dash/80/80.jpg"} 
                    className="w-14 h-14 rounded-2xl object-cover border border-white/10" 
                    alt="Profile" 
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">
                        {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Coder'}
                      </span>
                      <span className="text-[8px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded font-bold">🥇 GOLD</span>
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">III Year, NIT Trichy • CSE</div>
                    <div className="text-[10px] text-zinc-600 mono mt-1">dsaquest.io/v/arjun-m</div>
                  </div>
                </div>

                {/* Contribution Stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/5">
                    <div className="text-2xl font-bold mono text-zinc-600">0</div>
                    <div className="text-[9px] uppercase tracking-widest text-zinc-600 mt-1">Blogs Written</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/5">
                    <div className="text-2xl font-bold mono text-zinc-600">0</div>
                    <div className="text-[9px] uppercase tracking-widest text-zinc-600 mt-1">Resources Shared</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/5">
                    <div className="text-2xl font-bold mono text-zinc-600">0</div>
                    <div className="text-[9px] uppercase tracking-widest text-zinc-600 mt-1">Diagrams Created</div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-2">
                  <button className="contribute-btn w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/10 text-left group hover:bg-white/5 transition-all">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <PenLine className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">Share your project story</div>
                      <div className="text-[10px] text-zinc-600">How you built it, what you learned, what went wrong — your struggle helps others.</div>
                    </div>
                    <Plus className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                  </button>
                  <button className="contribute-btn w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/10 text-left group hover:bg-white/5 transition-all">
                    <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">Upload your study notes</div>
                      <div className="text-[10px] text-zinc-600">That cheat sheet you made before exams? Someone else needs it right now.</div>
                    </div>
                    <Plus className="w-4 h-4 text-zinc-600 group-hover:text-orange-400 transition-colors flex-shrink-0" />
                  </button>
                  <button className="contribute-btn w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/10 text-left group hover:bg-white/5 transition-all">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <Share2 className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">Found a great resource? Pass it on.</div>
                      <div className="text-[10px] text-zinc-600">That tutorial that finally made DP click — share the link so others click too.</div>
                    </div>
                    <Plus className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 transition-colors flex-shrink-0" />
                  </button>
                  <button className="contribute-btn w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/10 text-left group hover:bg-white/5 transition-all">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">Draw a diagram or flowchart</div>
                      <div className="text-[10px] text-zinc-600">Your rough BST traversal sketch? It's clearer than any textbook paragraph.</div>
                    </div>
                    <Plus className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                  </button>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-[10px] text-emerald-400">Share 3 resources to unlock the <strong>Contributor</strong> badge on your card</span>
                </div>
              </div>

              {/* Connected Profiles */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <LinkIcon className="w-3.5 h-3.5" /> Connected Profiles
                  </h2>
                  <button className="text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors font-medium flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-base">🟠</span>
                      <div><div className="text-xs font-medium">LeetCode <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded font-bold ml-1">SYNCED</span></div><div className="text-[10px] text-zinc-500">arjun_mishra • 487 solved</div></div>
                    </div>
                    <div className="text-right"><div className="text-xs mono font-semibold text-orange-400">1,847</div><div className="text-[9px] text-zinc-500">Rating</div></div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-base">🔴</span>
                      <div><div className="text-xs font-medium">Codeforces <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded font-bold ml-1">SYNCED</span></div><div className="text-[10px] text-zinc-500">arjun_mishra • Specialist</div></div>
                    </div>
                    <div className="text-right"><div className="text-xs mono font-semibold text-red-400">1,560</div><div className="text-[9px] text-zinc-500">Rating</div></div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-base">🟢</span>
                      <div><div className="text-xs font-medium">CodeChef <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded font-bold ml-1">SYNCED</span></div><div className="text-[10px] text-zinc-500">arjun_mishra • 4★</div></div>
                    </div>
                    <div className="text-right"><div className="text-xs mono font-semibold text-green-400">1,823</div><div className="text-[9px] text-zinc-500">Rating</div></div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-base">⚪</span>
                      <div><div className="text-xs font-medium">GitHub <span className="text-[8px] bg-yellow-500/20 text-yellow-400 px-1 py-0.5 rounded font-bold ml-1">SYNCING</span></div><div className="text-[10px] text-zinc-500">arjunmishra • 142 contrib</div></div>
                    </div>
                    <div className="text-right"><div className="text-xs mono font-semibold text-zinc-300">142</div><div className="text-[9px] text-zinc-500">Contribs</div></div>
                  </div>
                </div>
              </div>

              {/* Weekly Review */}
              <div className="glass rounded-2xl p-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-4">
                  <BarChart3 className="w-3.5 h-3.5" /> Weekly Review
                </h2>
                <div className="grid grid-cols-4 gap-3 mb-5">
                  <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5"><div className="text-xl font-bold mono text-emerald-400">12</div><div className="text-[9px] uppercase tracking-wider text-zinc-500">Problems</div></div>
                  <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5"><div className="text-xl font-bold mono text-cyan-400">3</div><div className="text-[9px] uppercase tracking-wider text-zinc-500">Contests</div></div>
                  <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5"><div className="text-xl font-bold mono text-purple-400">+87</div><div className="text-[9px] uppercase tracking-wider text-zinc-500">Rating Δ</div></div>
                  <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5"><div className="text-xl font-bold mono text-orange-400">7/7</div><div className="text-[9px] uppercase tracking-wider text-zinc-500">Streak</div></div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Sparkles className="w-3.5 h-3.5 text-emerald-400" /></div>
                  <p className="text-xs text-zinc-400 leading-relaxed">Graph accuracy dropped to 42%. Focus on BFS/DFS — try <span className="text-emerald-400">LC 200</span> and <span className="text-emerald-400">CF 1833D</span>. Your DP is strong (78%) — maintain it while you level up graphs.</p>
                </div>
              </div>
            </div>

            {/* Right 1/3 */}
            <div className="space-y-6">
              {/* Skill Map */}
              <div className="glass rounded-2xl p-5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-5">
                  <BarChart2 className="w-3.5 h-3.5" /> Skill Map
                </h2>
                <div className="flex items-end justify-between gap-2 h-40 mb-2">
                  <div className="flex-1 flex flex-col items-center gap-1"><div className="w-full rounded-t-md bg-emerald-500/80 prog-animated" style={{ height: '90%' }}></div><span className="text-[8px] text-zinc-500">DP</span></div>
                  <div className="flex-1 flex flex-col items-center gap-1"><div className="w-full rounded-t-md bg-emerald-500/60 prog-animated" style={{ height: '78%' }}></div><span className="text-[8px] text-zinc-500">Str</span></div>
                  <div className="flex-1 flex flex-col items-center gap-1"><div className="w-full rounded-t-md bg-emerald-500/50 prog-animated" style={{ height: '75%' }}></div><span className="text-[8px] text-zinc-500">Tree</span></div>
                  <div className="flex-1 flex flex-col items-center gap-1"><div className="w-full rounded-t-md bg-yellow-500/50 prog-animated" style={{ height: '65%' }}></div><span className="text-[8px] text-zinc-500">Grph</span></div>
                  <div className="flex-1 flex flex-col items-center gap-1"><div className="w-full rounded-t-md bg-yellow-500/40 prog-animated" style={{ height: '50%' }}></div><span className="text-[8px] text-zinc-500">Grdy</span></div>
                  <div className="flex-1 flex flex-col items-center gap-1"><div className="w-full rounded-t-md bg-red-500/40 prog-animated" style={{ height: '35%' }}></div><span className="text-[8px] text-zinc-500">Math</span></div>
                </div>
                <div className="flex items-center justify-between text-[9px] text-zinc-600">
                  <span>8/10 categories</span>
                  <span className="text-emerald-400">Well-rounded</span>
                </div>
              </div>

              {/* Upcoming Contests */}
              <div className="glass rounded-2xl p-5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-4">
                  <Calendar className="w-3.5 h-3.5" /> Upcoming
                </h2>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <div className="flex items-center justify-between mb-1"><span className="text-xs font-medium">CC Starters 245</span><span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">TODAY</span></div>
                    <div className="text-[10px] text-zinc-500">8:00 PM IST</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between mb-1"><span className="text-xs font-medium">LC Weekly 432</span><span className="text-[8px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded font-bold">TOMORROW</span></div>
                    <div className="text-[10px] text-zinc-500">8:00 AM IST</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between mb-1"><span className="text-xs font-medium">CF Round 1024</span><span className="text-[8px] bg-white/5 text-zinc-400 px-1.5 py-0.5 rounded font-bold">JUN 26</span></div>
                    <div className="text-[10px] text-zinc-500">9:35 PM IST</div>
                  </div>
                </div>
              </div>

              {/* Activity */}
              <div className="glass rounded-2xl p-5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-4">
                  <Activity className="w-3.5 h-3.5" /> Recent
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5"><CheckCircle className="w-3 h-3 text-emerald-400" /></div>
                    <div><div className="text-[11px] font-medium">Completed CC Starters 244</div><div className="text-[9px] text-zinc-600">4/6 solved • +32 rating • 2h ago</div></div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Flame className="w-3 h-3 text-orange-400" /></div>
                    <div><div className="text-[11px] font-medium">20-day streak!</div><div className="text-[9px] text-zinc-600">67% to Platinum • 5h ago</div></div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Trophy className="w-3 h-3 text-cyan-400" /></div>
                    <div><div className="text-[11px] font-medium">Top 15% in LC Weekly 431</div><div className="text-[9px] text-zinc-600">Almost top-10% for Platinum! • Yesterday</div></div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Medal className="w-3 h-3 text-yellow-400" /></div>
                    <div><div className="text-[11px] font-medium">🥇 Gold Card Unlocked</div><div className="text-[9px] text-zinc-600">Committed Learner • 3 days ago</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-6 px-6">
        <div className="max-w-7xl mx-auto text-center text-[10px] text-zinc-600">© 2025 DSA Quest. Built for students, backed by pros.</div>
      </footer>
    </div>
  );
}