"use client";

import React, { useState, useEffect } from 'react';
import { 
  Zap, Bell, LogIn, Trophy, BellRing, RefreshCw, ChevronsDown, 
  MousePointerClick, CalendarCheck, BookOpen, Route, Check, Target, Award,
  Mail, ShieldCheck, Clock, XCircle, Twitter, Github, Linkedin, Flame
} from 'lucide-react';
import DsaContestCard, { Contest } from '@/components/DsaContestCard';
import AuthModal from '@/components/AuthModal';

const INITIAL_CONTEST_DATA: Contest[] = [
  {
    id: 1, platform: 'hackerrank', platformColor: '#22c55e', platformBg: 'rgba(34,197,94,0.1)', platformBorder: 'rgba(34,197,94,0.2)',
    title: 'ProjectEuler+', status: 'live', statusLabel: 'LIVE NOW!',
    date: 'Jul 7, 2014', time: '9:08 PM IST', duration: '4776d 13h remaining',
    hot: false, participants: '12.4K'
  },
  {
    id: 2, platform: 'hackerearth', platformColor: '#3b82f6', platformBg: 'rgba(59,130,246,0.1)', platformBorder: 'rgba(59,130,246,0.2)',
    title: 'Turing Hiring Challenge 2026', status: 'live', statusLabel: 'LIVE NOW!',
    date: 'Jun 9, 2026', time: '6:31 PM IST', duration: '40d 3h remaining',
    hot: false, participants: '8.7K'
  },
  {
    id: 3, platform: 'codechef', platformColor: '#f97316', platformBg: 'rgba(249,115,22,0.1)', platformBorder: 'rgba(249,115,22,0.2)',
    title: 'Starters 244', status: 'today', statusLabel: 'TODAY!',
    date: 'Jun 24, 2026', time: '8:00 PM IST', duration: 'Starts in 2h 0m',
    hot: true, participants: '23.1K'
  },
  {
    id: 4, platform: 'leetcode', platformColor: '#eab308', platformBg: 'rgba(234,179,8,0.1)', platformBorder: 'rgba(234,179,8,0.2)',
    title: 'Weekly Contest 447', status: 'upcoming', statusLabel: 'UPCOMING',
    date: 'Jun 29, 2026', time: '8:00 AM IST', duration: 'Starts in 5d 4h',
    hot: false, participants: '—'
  },
  {
    id: 5, platform: 'codeforces', platformColor: '#ef4444', platformBg: 'rgba(239,68,68,0.1)', platformBorder: 'rgba(239,68,68,0.2)',
    title: 'Round 1023 (Div. 2)', status: 'upcoming', statusLabel: 'UPCOMING',
    date: 'Jun 27, 2026', time: '8:35 PM IST', duration: 'Starts in 3d 8h',
    hot: true, participants: '—'
  },
  {
    id: 6, platform: 'leetcode', platformColor: '#eab308', platformBg: 'rgba(234,179,8,0.1)', platformBorder: 'rgba(234,179,8,0.2)',
    title: 'Biweekly Contest 152', status: 'upcoming', statusLabel: 'UPCOMING',
    date: 'Jul 5, 2026', time: '10:30 PM IST', duration: 'Starts in 11d 2h',
    hot: false, participants: '—'
  }
];

export default function HomePage() {
  const [activePlatform, setActivePlatform] = useState('all');
  const [contests, setContests] = useState<Contest[]>(INITIAL_CONTEST_DATA);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const openAuth = () => {
    setIsAuthOpen(true);
  };

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await fetch('https://kontests.net/api/v1/all');
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        
        const mapped = data.slice(0, 12).map((c: any, index: number) => {
          let platformColor = '#3b82f6';
          let platformBg = 'rgba(59,130,246,0.1)';
          let platformBorder = 'rgba(59,130,246,0.2)';
          let platform = c.site.toLowerCase();
          
          if (platform.includes('codechef')) { platformColor = '#f97316'; platformBg = 'rgba(249,115,22,0.1)'; platformBorder = 'rgba(249,115,22,0.2)'; }
          else if (platform.includes('codeforces')) { platformColor = '#ef4444'; platformBg = 'rgba(239,68,68,0.1)'; platformBorder = 'rgba(239,68,68,0.2)'; }
          else if (platform.includes('leetcode')) { platformColor = '#eab308'; platformBg = 'rgba(234,179,8,0.1)'; platformBorder = 'rgba(234,179,8,0.2)'; }
          else if (platform.includes('hackerrank')) { platformColor = '#22c55e'; platformBg = 'rgba(34,197,94,0.1)'; platformBorder = 'rgba(34,197,94,0.2)'; }

          const status = c.status === 'CODING' ? 'live' : c.in_24_hours === 'Yes' ? 'today' : 'upcoming';
          const statusLabel = status === 'live' ? 'LIVE NOW!' : status === 'today' ? 'TODAY!' : 'UPCOMING';
          
          const sDate = new Date(c.start_time);
          const dateStr = sDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          const timeStr = sDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
          
          return {
            id: index + 100,
            platform: c.site,
            platformColor,
            platformBg,
            platformBorder,
            title: c.name,
            status,
            statusLabel,
            date: dateStr,
            time: timeStr,
            duration: c.duration ? `${Math.round(c.duration / 3600)}h` : 'Unknown',
            hot: status === 'live' || status === 'today',
            participants: '—'
          };
        });
        setContests(mapped);
      } catch (err) {
        console.error("Failed to fetch contests, using fallback.", err);
      }
    };
    fetchContests();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('auth') === 'signin') {
      setIsAuthOpen(true);
      // Clean up the URL query parameter without refreshing
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  const filterPlatform = (platform: string) => {
    setActivePlatform(platform);
    if (platform === 'all') {
      setContests(INITIAL_CONTEST_DATA);
    } else {
      setContests(INITIAL_CONTEST_DATA.filter(c => c.platform.toLowerCase().includes(platform)));
    }
  };

  const refreshContests = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      alert('Contest list refreshed! 🔄');
    }, 600);
  };

  const handleEmailSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.currentTarget.elements.namedItem('emailInput') as HTMLInputElement).value;
    alert(`Alerts activated for ${email}! 📬`);
    (e.currentTarget.elements.namedItem('emailInput') as HTMLInputElement).value = '';
  };

  return (
    <div className="min-h-screen">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#09090b]/85 backdrop-blur-[12px]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-semibold text-sm tracking-tight">DSA Quest</span>
            </a>
            <div className="hidden md:flex items-center gap-1">
              <a href="#contests" className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded">Contests</a>
              <a href="/dashboard" className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded">Dashboard</a>
              <a href="/resources" className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded">Resources</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={openAuth} className="px-3 py-1.5 rounded-lg border border-transparent text-zinc-300 text-xs font-medium hover:bg-white/5 transition-all">
              Sign In
            </button>
            <button onClick={openAuth} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-zinc-900 text-xs font-medium hover:bg-zinc-200 transition-all">
              <LogIn className="w-3.5 h-3.5" />
              Sign Up Free
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden grid-bg">
        <div className="absolute inset-0" style={{background: 'radial-gradient(ellipse at top, rgba(6,78,59,0.25), #09090b 60%)'}}></div>
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full opacity-[0.07]" style={{background: 'radial-gradient(circle, #10b981, transparent 70%)', filter: 'blur(80px)'}}></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.05]" style={{background: 'radial-gradient(circle, #06b6d4, transparent 70%)', filter: 'blur(60px)'}}></div>

        <div className="absolute top-32 right-20 float-anim hidden lg:block">
          <div className="glass rounded-xl p-3 flex items-center gap-2 opacity-60">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] text-zinc-400 font-mono">contest_live = true</span>
          </div>
        </div>
        <div className="absolute bottom-40 left-16 float-anim-delay hidden lg:block">
          <div className="glass rounded-xl p-3 flex items-center gap-2 opacity-40">
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-[10px] text-zinc-400">Streak: 30 days 🔥</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10 pt-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-8">
              <span className="relative flex h-2 w-2">
                <span className="live-pulse absolute inline-flex h-full w-full rounded-full bg-red-500"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">3 Contests Live Now</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter mb-6 gradient-text-hero leading-[1.1]">
              Never Miss a<br/>Contest Again
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed mb-4 max-w-xl mx-auto">
              Track every coding contest, hackathon, and interview sprint across 
              <span className="text-white font-medium"> 10+ platforms</span> — with alerts that reach your inbox 
              <span className="text-emerald-400 font-medium"> before anyone else</span>.
            </p>
            <p className="text-sm text-zinc-500 mb-10">
              Join 2,000+ students who never miss an opportunity.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <a href="#contests" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-all shadow-lg shadow-white/5">
                <Trophy className="w-4 h-4" />
                View Live Contests
              </a>
              <button onClick={() => alert('Alert system activated! 📬')} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white/5 transition-all">
                <BellRing className="w-4 h-4" />
                Get Email Alerts
              </button>
            </div>

            <div className="mt-16 flex items-center justify-center gap-6 flex-wrap opacity-30">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500">Tracking</span>
              <div className="w-px h-4 bg-zinc-700"></div>
              <span className="text-xs font-medium text-zinc-400">LeetCode</span>
              <span className="text-xs font-medium text-zinc-400">Codeforces</span>
              <span className="text-xs font-medium text-zinc-400">CodeChef</span>
              <span className="text-xs font-medium text-zinc-400">HackerRank</span>
              <span className="text-xs font-medium text-zinc-400">HackerEarth</span>
              <span className="text-xs font-medium text-zinc-400">AtCoder</span>
              <span className="text-xs font-medium text-zinc-400 hidden sm:inline">GFG</span>
              <span className="text-xs font-medium text-zinc-400 hidden sm:inline">Kick Start</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[9px] uppercase tracking-widest text-zinc-600">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border border-zinc-700 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-zinc-500 countdown-tick"></div>
          </div>
        </div>
      </section>

      {/* LIVE CONTESTS SECTION */}
      <section id="contests" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="live-pulse absolute inline-flex h-full w-full rounded-full bg-red-500"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">Live & Upcoming</span>
              </div>
              <h2 className="text-3xl font-medium tracking-tight">Contest Board</h2>
              <p className="text-sm text-zinc-500 mt-1">Get contest alerts before others do!</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button 
                  className={`platform-tag px-2.5 py-1 rounded-md text-[10px] font-medium text-zinc-400 border border-transparent ${activePlatform === 'all' ? 'active' : ''}`}
                  onClick={() => filterPlatform('all')}
                >
                  All
                </button>
                <button 
                  className={`platform-tag px-2.5 py-1 rounded-md text-[10px] font-medium text-zinc-400 border border-transparent flex items-center gap-1 ${activePlatform === 'leetcode' ? 'active' : ''}`}
                  onClick={() => filterPlatform('leetcode')}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>LeetCode
                </button>
                <button 
                  className={`platform-tag px-2.5 py-1 rounded-md text-[10px] font-medium text-zinc-400 border border-transparent flex items-center gap-1 ${activePlatform === 'codeforces' ? 'active' : ''}`}
                  onClick={() => filterPlatform('codeforces')}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Codeforces
                </button>
                <button 
                  className={`platform-tag px-2.5 py-1 rounded-md text-[10px] font-medium text-zinc-400 border border-transparent flex items-center gap-1 ${activePlatform === 'codechef' ? 'active' : ''}`}
                  onClick={() => filterPlatform('codechef')}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>CodeChef
                </button>
                <button 
                  className={`platform-tag px-2.5 py-1 rounded-md text-[10px] font-medium text-zinc-400 border border-transparent flex items-center gap-1 hidden sm:flex ${activePlatform === 'hackerrank' ? 'active' : ''}`}
                  onClick={() => filterPlatform('hackerrank')}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>HackerRank
                </button>
                <button 
                  className={`platform-tag px-2.5 py-1 rounded-md text-[10px] font-medium text-zinc-400 border border-transparent flex items-center gap-1 hidden sm:flex ${activePlatform === 'hackerearth' ? 'active' : ''}`}
                  onClick={() => filterPlatform('hackerearth')}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>HackerEarth
                </button>
              </div>
              <button 
                onClick={refreshContests} 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-xs font-medium text-zinc-400 hover:text-white transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {contests.map((contest, index) => (
              <DsaContestCard key={contest.id} contest={contest} index={index} />
            ))}
          </div>

          <div className="text-center mt-10">
            <button onClick={() => alert('Loading more contests...')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-zinc-400 text-xs font-medium hover:bg-white/5 hover:text-white transition-all">
              <ChevronsDown className="w-4 h-4" />
              View All Upcoming Contests
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="absolute inset-0" style={{background: 'radial-gradient(ellipse at center, rgba(24,24,27,0.5), #09090b)'}}></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3 block">Simple & Powerful</span>
            <h2 className="text-3xl font-medium tracking-tight mb-3">How DSA Quest Works</h2>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">Three steps to never missing an opportunity again. No complicated setup, no spam — just timely alerts.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

            <div className="text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5 relative z-10" style={{background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.2)'}}>
                <MousePointerClick className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Step 1</div>
              <h3 className="text-lg font-medium mb-2">One-Click Sign Up</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Just enter your email. No account creation, no passwords to remember. One click and you're in.</p>
            </div>

            <div className="text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-5 relative z-10">
                <CalendarCheck className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Step 2</div>
              <h3 className="text-lg font-medium mb-2">Pick Your Platforms</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Select which platforms and contest types you care about. We track 10+ platforms so you don't have to.</p>
            </div>

            <div className="text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-5 relative z-10">
                <BellRing className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2">Step 3</div>
              <h3 className="text-lg font-medium mb-2">Get Alerts Instantly</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Receive email reminders before contests begin. Never miss a deadline or timezone mix-up again.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES / VISION SECTION */}
      <section id="features" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{background: 'radial-gradient(circle, #10b981, transparent 70%)', filter: 'blur(80px)'}}></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3 block">The Grand Vision</span>
            <h2 className="text-3xl font-medium tracking-tight mb-3">More Than a Reminder</h2>
            <p className="text-sm text-zinc-500 max-w-lg mx-auto">DSA Quest is evolving from a simple contest tracker into the definitive starter pack for every tech student — completely free, ad-free, forever.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="feature-card glass rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.04]" style={{background: 'radial-gradient(circle, #10b981, transparent 70%)'}}></div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Expert Knowledge Hub</h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-4">Curated resources by verified industry professionals — real interview experiences, career playbooks, and study materials from SDEs at top companies.</p>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <img src="https://picsum.photos/seed/exp1/32/32.jpg" className="w-6 h-6 rounded-full border-2 border-zinc-950 object-cover" alt="expert" />
                  <img src="https://picsum.photos/seed/exp2/32/32.jpg" className="w-6 h-6 rounded-full border-2 border-zinc-950 object-cover" alt="expert" />
                  <img src="https://picsum.photos/seed/exp3/32/32.jpg" className="w-6 h-6 rounded-full border-2 border-zinc-950 object-cover" alt="expert" />
                </div>
                <span className="text-[10px] text-zinc-500">89 verified pros</span>
              </div>
            </div>

            <div className="feature-card glass rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.04]" style={{background: 'radial-gradient(circle, #06b6d4, transparent 70%)'}}></div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                <Route className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Personalized Guidance</h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-4">No generic roadmaps — every journey is different. Share your profiles and get custom weekly progress check-ins with focused study suggestions.</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                  <Check className="w-3 h-3 text-cyan-400" />
                  <span className="text-[10px] text-cyan-400 font-medium">Weekly Review</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/5">
                  <Target className="w-3 h-3 text-zinc-400" />
                  <span className="text-[10px] text-zinc-400 font-medium">Custom Path</span>
                </div>
              </div>
            </div>

            <div className="feature-card glass rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.04]" style={{background: 'radial-gradient(circle, #a855f7, transparent 70%)'}}></div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Milestone Cards</h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-4">Hit a streak? Crush a coding round? Get a beautifully designed digital card — share verifiable proof of your hustle directly to LinkedIn.</p>
              <div className="milestone-card rounded-lg p-3 border border-emerald-500/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold">30-Day Streak 🔥</div>
                    <div className="text-[9px] text-zinc-500">Share to LinkedIn &rarr;</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EMAIL SIGNUP SECTION */}
      <section id="community" className="py-24 px-6 relative">
        <div className="absolute inset-0" style={{background: 'radial-gradient(ellipse at bottom, rgba(6,78,59,0.15), #09090b 60%)'}}></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="glass rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-[0.06]" style={{background: 'radial-gradient(circle, #10b981, transparent 70%)'}}></div>

              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <BellRing className="w-6 h-6 text-emerald-400" />
              </div>

              <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-3">Get Alerts Before Others Do</h2>
              <p className="text-sm text-zinc-500 mb-8 max-w-md mx-auto">One email per day. Zero spam. Unsubscribe anytime. Join 2,000+ students who never miss a contest.</p>

              <form onSubmit={handleEmailSignup} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                <div className="relative flex-1 w-full">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="email" name="emailInput" required placeholder="your@email.com" className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-emerald-500/50 transition-colors" />
                </div>
                <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-all whitespace-nowrap">
                  <Zap className="w-4 h-4" />
                  Activate Alerts
                </button>
              </form>

              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  No spam, ever
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  Alerts 30min before
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <XCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Unsubscribe anytime
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="font-semibold text-sm">DSA Quest</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">The definitive starter pack for every tech student. Free, ad-free, forever.</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Platform</h4>
              <div className="space-y-2">
                <a href="#contests" className="block text-xs text-zinc-400 hover:text-white transition-colors">Contest Board</a>
                <a href="#features" className="block text-xs text-zinc-400 hover:text-white transition-colors">Features</a>
                <a href="#community" className="block text-xs text-zinc-400 hover:text-white transition-colors">Community Hub</a>
                <a href="#" className="block text-xs text-zinc-400 hover:text-white transition-colors">Milestone Cards</a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Platforms Tracked</h4>
              <div className="space-y-2">
                <a href="#" className="block text-xs text-zinc-400 hover:text-white transition-colors">LeetCode</a>
                <a href="#" className="block text-xs text-zinc-400 hover:text-white transition-colors">Codeforces</a>
                <a href="#" className="block text-xs text-zinc-400 hover:text-white transition-colors">CodeChef</a>
                <a href="#" className="block text-xs text-zinc-400 hover:text-white transition-colors">HackerRank</a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Connect</h4>
              <div className="flex items-center gap-3 mb-4">
                <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                  <Github className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
              <a href="#" className="text-xs text-zinc-400 hover:text-white transition-colors">hello@dsaquest.com</a>
            </div>
          </div>
          <div className="pt-6 border-t border-white/5 flex items-center justify-between flex-wrap gap-4">
            <div className="text-[10px] text-zinc-600">© 2025 DSA Quest. Built with ❤️ for students everywhere.</div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors">Privacy</a>
              <a href="#" className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
