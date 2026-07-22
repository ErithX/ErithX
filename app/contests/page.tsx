"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Bell, LogIn, Trophy, BellRing, RefreshCw, ChevronsDown, 
  MousePointerClick, CalendarCheck, BookOpen, Route, Check, Target, Award,
  Mail, ShieldCheck, Clock, XCircle, Twitter, Github, Linkedin, Flame, LogOut
} from 'lucide-react';
import DsaContestCard, { Contest } from '@/components/DsaContestCard';
import AuthModal from '@/components/AuthModal';
import { contestFetch } from '@/app/utils/contestFetch';
import { createClient } from '@/app/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/authStore';

const INITIAL_CONTEST_DATA: Contest[] = [];

export default function HomePage() {
  const [activePlatform, setActivePlatform] = useState('all');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState('All');
  
  const [allContests, setAllContests] = useState<Contest[]>(INITIAL_CONTEST_DATA);
  const [contests, setContests] = useState<Contest[]>(INITIAL_CONTEST_DATA);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [subscribedMessage, setSubscribedMessage] = useState('');
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);
  const difficultyRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (difficultyRef.current && !difficultyRef.current.contains(event.target as Node)) {
        setIsDifficultyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openAuth = () => {
    setIsAuthOpen(true);
  };

  useEffect(() => {
    const loadContests = async () => {
      const mapped = await contestFetch();
      if (mapped) {
        setAllContests(mapped);
        setContests(mapped);
      }
    };
    loadContests();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('auth') === 'signin') {
      window.setTimeout(() => setIsAuthOpen(true), 0);
      // Clean up the URL query parameter without refreshing
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
    // Auth Listener removed, using Zustand store
  }, []);

  const applyFilters = (platform = activePlatform, category = activeCategory, difficulty = activeDifficulty) => {
    // Check if platform belongs to new category
    if (category !== 'All' && platform !== 'all') {
      const platformContest = allContests.find(c => c.platform === platform);
      if (platformContest && platformContest.category !== category) {
        platform = 'all';
      }
    }

    setActivePlatform(platform);
    setActiveCategory(category);
    setActiveDifficulty(difficulty);

    const filtered = allContests.filter(c => {
      const matchPlatform = platform === 'all' || c.platform.toLowerCase() === platform.toLowerCase();
      const matchCategory = category === 'All' || c.category === category;
      const matchDifficulty = difficulty === 'All' || c.difficulty === difficulty;
      return matchPlatform && matchCategory && matchDifficulty;
    });

    setContests(filtered);
    setVisibleCount(12);
  };

  const refreshContests = async () => {
    setIsRefreshing(true);
    const mapped = await contestFetch();
    if (mapped) {
      setAllContests(mapped);
      setContests(mapped);
    }
    setIsRefreshing(false);
  };

  const handleEmailSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.currentTarget.elements.namedItem('emailInput') as HTMLInputElement).value;
    setSubscribedMessage(`Alerts activated for ${email}! 📬`);
    (e.currentTarget.elements.namedItem('emailInput') as HTMLInputElement).value = '';
    setTimeout(() => setSubscribedMessage(''), 5000);
  };

  let categoryFilteredPlatforms = Array.from(new Set(allContests.map(c => c.platform))).filter(Boolean);
  if (activeCategory !== 'All') {
    categoryFilteredPlatforms = categoryFilteredPlatforms.filter(p => {
      const config = allContests.find(c => c.platform === p);
      return config && config.category === activeCategory;
    });
  }
  
  const sortedPlatforms = categoryFilteredPlatforms.sort((a, b) => {
      const pA = allContests.find(c => c.platform === a)?.priority;
      const pB = allContests.find(c => c.platform === b)?.priority;
      const weight = { 'Hot': 3, 'Recommended': 2, 'More': 1 };
      return (weight[pB as keyof typeof weight] || 0) - (weight[pA as keyof typeof weight] || 0);
  });

  const visiblePlatforms = showAllPlatforms ? sortedPlatforms : sortedPlatforms.slice(0, 6);

  const platformButtons = visiblePlatforms.map(platform => {
    const sampleContest = allContests.find(c => c.platform === platform);
    
    let displayName = platform.replace(/\.(com|org|net|jp|io)(\/.*)?$/, '');
    if (displayName.toLowerCase().includes('leetcode')) displayName = 'LeetCode';
    else if (displayName.toLowerCase().includes('codeforces')) displayName = 'Codeforces';
    else if (displayName.toLowerCase().includes('codechef')) displayName = 'CodeChef';
    else if (displayName.toLowerCase().includes('hackerrank')) displayName = 'HackerRank';
    else if (displayName.toLowerCase().includes('hackerearth')) displayName = 'HackerEarth';
    else if (displayName.toLowerCase().includes('atcoder')) displayName = 'AtCoder';
    else if (displayName.toLowerCase().includes('geeksforgeeks')) displayName = 'GeeksforGeeks';
    else if (displayName.toLowerCase().includes('topcoder')) displayName = 'TopCoder';
    else displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

    return (
      <button 
        key={platform}
        className={`platform-tag px-2.5 py-1 rounded-md text-[10px] font-medium text-zinc-400 border border-transparent flex items-center gap-1 ${activePlatform === platform ? 'active' : ''}`}
        onClick={() => applyFilters(platform, activeCategory, activeDifficulty)}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: sampleContest?.platformColor || '#a1a1aa' }}></span>
        {displayName}
      </button>
    );
  });

  const liveCount = allContests.filter(c => c.status.toLowerCase() === 'live').length;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden grid-bg">
        <div className="absolute inset-0" style={{background: 'radial-gradient(ellipse at top, rgba(6,78,59,0.25), #09090b 60%)'}}></div>
        <div className="absolute top-0 left-1/3 w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full opacity-[0.07]" style={{background: 'radial-gradient(circle, #10b981, transparent 70%)', filter: 'blur(80px)'}}></div>
        <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full opacity-[0.05]" style={{background: 'radial-gradient(circle, #06b6d4, transparent 70%)', filter: 'blur(60px)'}}></div>



        <div className="max-w-6xl w-full mx-auto px-6 relative z-10 pt-20 pb-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-8">
              <span className="relative flex h-2 w-2">
                <span className="live-pulse absolute inline-flex h-full w-full rounded-full bg-red-500"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">{liveCount} Contests Live Now</span>
            </div>

            <h1 className="text-4xl md:text-7xl font-medium tracking-tighter mb-6 gradient-text-hero leading-[1.1]">
              Never Miss a<br/>Contest Again
            </h1>
            <p className="text-base md:text-lg text-zinc-400 leading-relaxed mb-4 max-w-xl mx-auto">
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
              <a href="#community" className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white/5 transition-all">
                <BellRing className="w-4 h-4" />
                Get Email Alerts
              </a>
            </div>

            <div className="mt-5 opacity-70 hover:opacity-100 transition-opacity overflow-hidden relative w-full mask-edges">
              <div className="flex items-center gap-12 animate-marquee py-2">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 mr-4 font-bold shrink-0">TRACKING</span>
                {['leetcode', 'codeforces', 'codechef', 'hackerrank', 'hackerearth', 'atcoder', 'geeksforgeeks', 'topcoder', 'kaggle', 'google', 'meta', 'apple'].map((platform, i) => (
                  platform === 'atcoder' ? (
                    <div key={i} className="flex items-center gap-1.5 shrink-0 transition-all hover:scale-110 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">
                      
                      <span className="font-bold text-zinc-300 text-sm tracking-tight">AtCoder</span>
                    </div>
                  ) : (
                    <img 
                      key={i} 
                      src={`https://cdn.simpleicons.org/${platform}`} 
                      alt={platform} 
                      className="h-6 w-auto shrink-0 transition-all hover:scale-110 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" 
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )
                ))}
                {/* Duplicate for infinite effect */}
                {['leetcode', 'codeforces', 'codechef', 'hackerrank', 'hackerearth', 'atcoder', 'geeksforgeeks', 'topcoder', 'kaggle', 'google', 'meta', 'apple'].map((platform, i) => (
                  platform === 'atcoder' ? (
                    <div key={i + 'dup'} className="flex items-center gap-1.5 shrink-0 transition-all hover:scale-110 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">
                      <div className="bg-zinc-800 border border-zinc-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm">AC</div>
                      <span className="font-bold text-zinc-300 text-sm tracking-tight">AtCoder</span>
                    </div>
                  ) : (
                    <img 
                      key={i + 'dup'} 
                      src={`https://cdn.simpleicons.org/${platform}`} 
                      alt={platform} 
                      className="h-6 w-auto shrink-0 transition-all hover:scale-110 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" 
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )
                ))}
              </div>
              <style>{`
                .mask-edges {
                  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }
                @keyframes marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                  display: flex;
                  width: max-content;
                  animation: marquee 25s linear infinite;
                }
                .animate-marquee:hover {
                  animation-play-state: paused;
                }
              `}</style>
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
            <div className="w-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="live-pulse absolute inline-flex h-full w-full rounded-full bg-red-500"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">Live & Upcoming</span>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <h2 className="text-3xl font-medium tracking-tight">Live & Upcoming Coding Competitions Dashboard</h2>
                <button onClick={refreshContests} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-xs font-medium text-zinc-400 hover:text-white transition-all">
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {/* Advanced Filter Bar */}
              <div className="flex flex-col gap-4 mb-6 bg-transparent">
                
                {/* Row 1: Category */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-[10px] sm:text-xs text-zinc-500 font-medium min-w-[70px] uppercase tracking-wider">Category</span>
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full pb-1 sm:pb-0">
                    {['All', 'DSA & CP', 'AI / ML', 'Cybersecurity (CTF)'].map(cat => (
                      <button key={cat} onClick={() => applyFilters(activePlatform, cat, activeDifficulty)} className={`px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold border whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-emerald-500 text-zinc-950 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white'}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 2: Difficulty & Platform */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                  {/* Difficulty (Left Side) */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="text-[10px] sm:text-xs text-zinc-500 font-medium min-w-[70px] uppercase tracking-wider">Difficulty</span>
                    <div className="relative" ref={difficultyRef}>
                      <button
                        onClick={() => setIsDifficultyOpen(!isDifficultyOpen)}
                        className="bg-transparent border border-white/10 text-zinc-200 text-xs rounded-lg pl-3 pr-8 py-2 outline-none focus:border-emerald-500/50 min-w-[150px] cursor-pointer text-left relative flex items-center justify-between hover:bg-white/5 transition-colors"
                      >
                        <span>
                          {activeDifficulty === 'Beginner' ? 'Beginner' : 
                           activeDifficulty === 'Intermediate' ? 'Intermediate' : 'All Difficulties'}
                        </span>
                        <div className="text-zinc-500 text-[10px]">▼</div>
                      </button>
                      
                      {isDifficultyOpen && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-[#09090b]/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden shadow-2xl z-20 animate-in fade-in zoom-in-95">
                          {['All', 'Beginner', 'Intermediate'].map((diff) => (
                            <button
                              key={diff}
                              onClick={() => {
                                applyFilters(activePlatform, activeCategory, diff);
                                setIsDifficultyOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs transition-colors ${activeDifficulty === diff ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-300 hover:bg-emerald-500/10 hover:text-emerald-400'}`}
                            >
                              {diff === 'Beginner' ? 'Beginner' : diff === 'Intermediate' ? 'Intermediate' : 'All Difficulties'}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Platform (Right Side) */}
                  <div className="flex flex-wrap gap-1.5 justify-start md:justify-end">
                    <button className={`platform-tag px-2.5 py-1 rounded-md text-[10px] font-medium text-zinc-400 border border-transparent ${activePlatform === 'all' ? 'active' : ''}`} onClick={() => applyFilters('all', activeCategory, activeDifficulty)}>All</button>
                    {platformButtons}
                    {!showAllPlatforms && sortedPlatforms.length > 6 && (
                      <button onClick={() => setShowAllPlatforms(true)} className="px-2.5 py-1 rounded-md text-[10px] font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
                        Discover More ({sortedPlatforms.length - 6}+)
                      </button>
                    )}
                    {showAllPlatforms && (
                      <button onClick={() => setShowAllPlatforms(false)} className="px-2.5 py-1 rounded-md text-[10px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors border border-transparent">
                        Show Less
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {contests.slice(0, visibleCount).map((contest, index) => (
              <DsaContestCard key={contest.id} contest={contest} index={index} />
            ))}
          </div>

          {contests.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
              <p className="text-sm font-medium text-zinc-300">No contests match this filtered feed right now.</p>
              <p className="mt-2 text-xs text-zinc-500">Try refreshing, or switch back to All categories.</p>
            </div>
          )}

          <div className="text-center mt-10">
            {visibleCount < contests.length && (
              <button onClick={() => setVisibleCount(prev => prev + 12)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-zinc-400 text-xs font-medium hover:bg-white/5 hover:text-white transition-all">
                <ChevronsDown className="w-4 h-4" />
                View More Contests
              </button>
            )}
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
              <p className="text-xs text-zinc-500 leading-relaxed">Just enter your email. No account creation, no passwords to remember. One click and you&apos;re in.</p>
            </div>

            <div className="text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-5 relative z-10">
                <CalendarCheck className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Step 2</div>
              <h3 className="text-lg font-medium mb-2">Pick Your Platforms</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Select which platforms and contest types you care about. We track 10+ platforms so you don&apos;t have to.</p>
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
            <h2 className="text-3xl font-medium tracking-tight mb-3">DSA Quest: The Complete Computer Science Student Portal</h2>
            <p className="text-sm text-zinc-500 max-w-lg mx-auto">DSA Quest is evolving from a simple contest tracker into the definitive starter pack for every tech student — completely free, ad-free, forever.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="feature-card glass rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.04]" style={{background: 'radial-gradient(circle, #10b981, transparent 70%)'}}></div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Expert Engineering Resource Hub</h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-4">Curated resources by verified industry professionals — real interview experiences, career playbooks, and study materials from SDEs at top companies.</p>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border-2 border-zinc-950 bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[8px] font-bold">P</div>
                  <div className="w-6 h-6 rounded-full border-2 border-zinc-950 bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[8px] font-bold">R</div>
                  <div className="w-6 h-6 rounded-full border-2 border-zinc-950 bg-purple-500/20 text-purple-400 flex items-center justify-center text-[8px] font-bold">S</div>
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

              {subscribedMessage && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                  <Check className="w-3.5 h-3.5" />
                  {subscribedMessage}
                </div>
              )}

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


      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
