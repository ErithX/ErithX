"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Zap, PenLine, PlusCircle, LayoutDashboard, FileText, UserPen,
  Repeat2, Settings, Eye, GraduationCap, ArrowUp, Layers,
  TrendingUp, Users, MoreHorizontal, Image as ImageIcon, Link as LinkIcon,
  MessageSquare, Edit, BadgeCheck, Check, Linkedin, Twitter, Github
} from 'lucide-react';
import { createClient } from '@/app/lib/supabase/client';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

export default function ProDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-emerald-800 selection:text-white pb-16 font-sans">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="px-4 py-3 rounded-xl backdrop-blur-md text-xs font-medium flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Check className="w-4 h-4" />
            {toastMessage}
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <DashboardNavbar 
        user={user} 
        loading={loading} 
        isDropdownOpen={isDropdownOpen} 
        setIsDropdownOpen={setIsDropdownOpen} 
        dropdownRef={dropdownRef} 
        handleLogout={handleLogout} 
      />

      {/* MAIN LAYOUT */}
      <div className="pt-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">

          {/* LEFT SIDEBAR */}
          <aside className="md:w-60 flex-shrink-0">
            <div className="sticky top-20">
              <div className="mb-6 px-3">
                <h1 className="text-lg font-semibold tracking-tight">Creator Studio</h1>
                <p className="text-[11px] text-zinc-500 mt-0.5">Manage your impact & content.</p>
              </div>
              
              <button className="w-full flex items-center justify-center gap-2 mb-6 px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all">
                <PlusCircle className="w-3.5 h-3.5" /> Create Resource
              </button>

              <nav className="space-y-1">
                <a href="#overview" className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-white bg-white/5 border-l-2 border-emerald-500 rounded-r-md transition-all">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Overview
                </a>
                <a href="#content" className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-md transition-all border-l-2 border-transparent">
                  <FileText className="w-3.5 h-3.5" /> Content Manager
                </a>
                <a href="#profile" className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-md transition-all border-l-2 border-transparent">
                  <UserPen className="w-3.5 h-3.5" /> Public Profile
                </a>
                
                <div className="pt-4 mt-4 border-t border-white/5"></div>
                
                <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-md transition-all">
                  <Repeat2 className="w-3.5 h-3.5" /> Switch to Student View
                </Link>
                <a href="#" className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-md transition-all">
                  <Settings className="w-3.5 h-3.5" /> Settings
                </a>
              </nav>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <main className="flex-1 min-w-0 space-y-12">

            {/* 1. OVERVIEW SECTION */}
            <section id="overview" className="space-y-6">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-1">Overview</h2>
                <p className="text-xs text-zinc-600">Your impact across the DSA Quest ecosystem.</p>
              </div>

              {/* Impact Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500">Total Reach</span>
                    <Eye className="w-3.5 h-3.5 text-zinc-600" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">12,847</div>
                  <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12% this week</div>
                </div>
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500">Students Helped</span>
                    <GraduationCap className="w-3.5 h-3.5 text-zinc-600" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">3,452</div>
                  <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1"><Users className="w-3 h-3" /> 89 saved your notes</div>
                </div>
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500">Upvotes</span>
                    <ArrowUp className="w-3.5 h-3.5 text-zinc-600" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">1,205</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Avg 4.8 per post</div>
                </div>
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500">Resources</span>
                    <Layers className="w-3.5 h-3.5 text-zinc-600" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">12</div>
                  <div className="text-[10px] text-yellow-400 mt-1">1 pending review</div>
                </div>
              </div>

              {/* Drafts & Top Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pick up where you left off */}
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-zinc-200">Continue Writing</h3>
                    <PenLine className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-colors cursor-pointer group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Draft · Blog</span>
                        <span className="text-[10px] text-zinc-600">Edited 2h ago</span>
                      </div>
                      <div className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">System Design Primer: Caching Strategies</div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-600 font-mono">412 words</span>
                        <button className="text-[10px] text-emerald-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Resume →</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Performing Content */}
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-zinc-200">Top Performing</h3>
                    <TrendingUp className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-emerald-400">1</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-zinc-300 truncate">Mastering Dynamic Programming</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">4,201 views · 521 upvotes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. PUBLIC PROFILE SECTION */}
            <section id="profile" className="space-y-6 pt-12 border-t border-white/5">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-1">Public Profile</h2>
                <p className="text-xs text-zinc-600">This information appears on your Author Cards across the platform.</p>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-xl p-6 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-white/5">
                  <img 
                    src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Pro"} 
                    className="w-20 h-20 rounded-full object-cover border border-white/10" 
                    alt="Avatar" 
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Pro" }}
                  />
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-white">{user?.user_metadata?.full_name || 'Professional User'}</div>
                    <div className="text-xs text-emerald-400 flex items-center gap-1.5 mt-1">
                      <BadgeCheck className="w-3.5 h-3.5" /> Verified Industry Professional
                    </div>
                    <p className="text-xs text-zinc-500 mt-2 max-w-md">Software Engineer sharing real interview experiences and career playbooks.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Current Company</label>
                    <input type="text" defaultValue="Google" className="w-full bg-white/[0.03] border border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all outline-none px-3 py-2 rounded-lg text-sm text-zinc-200 font-mono" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Job Title</label>
                    <input type="text" defaultValue="Software Engineer II" className="w-full bg-white/[0.03] border border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all outline-none px-3 py-2 rounded-lg text-sm text-zinc-200 font-mono" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Short Bio</label>
                  <textarea rows={3} defaultValue="Software Engineer at Google. Passionate about making DSA accessible. Sharing real interview experiences and career playbooks." className="w-full bg-white/[0.03] border border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all outline-none px-3 py-2 rounded-lg text-sm text-zinc-200 resize-none"></textarea>
                  <p className="text-[10px] text-zinc-600 mt-1 text-right">126 / 160 characters</p>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button onClick={() => showToast('Public profile updated! 🎉')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-all shadow-lg">
                    <Check className="w-4 h-4" /> Save Profile
                  </button>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
