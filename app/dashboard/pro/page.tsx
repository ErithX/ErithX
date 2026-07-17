"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Zap, PenLine, PlusCircle, LayoutDashboard, FileText, UserPen,
  Repeat2, Settings, Eye, GraduationCap, ArrowUp, Layers,
  TrendingUp, Users, MoreHorizontal, Image as ImageIcon, Link as LinkIcon,
  MessageSquare, Edit, BadgeCheck, Check, Linkedin, Twitter, Github, Trash2
} from 'lucide-react';
import { createClient } from '@/app/lib/supabase/client';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { useRouter } from 'next/navigation';
import { calculateEngagementScore } from '@/app/lib/algorithms/topContent';
import { useAuthStore } from '@/store/authStore';

export default function ProDashboardPage() {
  const { user, loading } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Data States
  const [drafts, setDrafts] = useState<any[]>([]);
  const [published, setPublished] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({
    company: '',
    job_title: '',
    bio: ''
  });
  const [isSaving, setIsSaving] = useState(false);

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
    if (user) {
        // Fetch Profile
        fetch('/api/user/profile')
          .then(res => res.json())
          .then(data => {
            if (data.profile) setProfile(data.profile);
          });
        
        // Fetch Drafts
        fetch('/api/resources/user?status=draft')
          .then(res => res.json())
          .then(data => setDrafts(data));

        // Fetch Published/Pending
        fetch('/api/resources/user?status=published,pending')
          .then(res => res.json())
          .then(data => setPublished(data));
      }
  }, [user]);

  const handleProfileSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: profile.company,
          job_title: profile.job_title,
          bio: profile.bio
        })
      });
      if (res.ok) {
        showToast('Public profile updated! 🎉');
      } else {
        showToast('Failed to save profile. Ensure database columns exist.');
      }
    } catch (e) {
      console.error(e);
      showToast('Error saving profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleDeleteDraft = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent navigating to /write
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this draft?')) return;
    
    try {
      const res = await fetch(`/api/resources/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDrafts(drafts.filter(d => d._id !== id));
        showToast('Draft deleted successfully');
      } else {
        showToast('Failed to delete draft');
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting draft');
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Split published and pending
  const publishedPosts = published.filter(p => p.status === 'published');
  const pendingPosts = published.filter(p => p.status === 'pending');

  // Calculate stats based ONLY on fully published posts
  const totalViews = publishedPosts.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalUpvotes = publishedPosts.reduce((acc, curr) => acc + (curr.upvotes || 0), 0);
  
  // Top performing logic: rank by engagement score, only include actually published posts
  const topPerforming = [...publishedPosts]
    .sort((a, b) => calculateEngagementScore(b) - calculateEngagementScore(a))
    .slice(0, 3);

  // Combine drafts and pending for the "Continue Writing / Pending" box
  const draftsAndPending = [...drafts, ...pendingPosts];

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
                <h2 className="text-lg font-semibold tracking-tight">Creator Studio</h2>
                <p className="text-[11px] text-zinc-500 mt-0.5">Manage your impact & content.</p>
              </div>
              
              <Link href="/dashboard/write" className="w-full flex items-center justify-center gap-2 mb-6 px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all">
                <PlusCircle className="w-3.5 h-3.5" /> Create Resource
              </Link>

              <nav className="space-y-1">
                <a href="#overview" className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-white bg-white/5 border-l-2 border-emerald-500 rounded-r-md transition-all">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Overview
                </a>
                {/* 
                <a href="#content" className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-md transition-all border-l-2 border-transparent">
                  <FileText className="w-3.5 h-3.5" /> Content Manager
                </a> 
                */}
                <a href="#profile" className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-md transition-all border-l-2 border-transparent">
                  <UserPen className="w-3.5 h-3.5" /> Public Profile
                </a>
                
                <div className="pt-4 mt-4 border-t border-white/5"></div>
                
                {user?.user_metadata?.role !== 'professional' && (
                  <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-md transition-all">
                    <Repeat2 className="w-3.5 h-3.5" /> Switch to Student View
                  </Link>
                )}
                {/*
                <a href="#" className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-md transition-all">
                  <Settings className="w-3.5 h-3.5" /> Settings
                </a>
                */}
              </nav>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <main className="flex-1 min-w-0 space-y-12">

            {/* 1. OVERVIEW SECTION */}
            <section id="overview" className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Creator Studio</h1>
                <p className="text-sm text-zinc-400">Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Creator'}!</p>
              </div>

              {/* Impact Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500">Total Reach</span>
                    <Eye className="w-3.5 h-3.5 text-zinc-600" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">{totalViews.toLocaleString()}</div>
                  <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">Lifetime views</div>
                </div>
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500">Students Helped</span>
                    <GraduationCap className="w-3.5 h-3.5 text-zinc-600" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">—</div>
                  <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">Coming Soon</div>
                </div>
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500">Upvotes</span>
                    <ArrowUp className="w-3.5 h-3.5 text-zinc-600" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">{totalUpvotes.toLocaleString()}</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Total upvotes received</div>
                </div>
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500">Resources</span>
                    <Layers className="w-3.5 h-3.5 text-zinc-600" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">{publishedPosts.length}</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Published Resources</div>
                </div>
              </div>

              {/* Drafts & Top Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pick up where you left off */}
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-zinc-200">Pending & Drafts</h3>
                    <PenLine className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="space-y-3">
                    {draftsAndPending.length === 0 ? (
                      <div className="text-xs text-zinc-500 italic p-3 text-center">No drafts or pending content found.</div>
                    ) : (
                      draftsAndPending.map((draft) => (
                        <div key={draft._id} className="block p-3 rounded-lg bg-white/[0.02] border border-white/5 transition-colors group relative">
                          {/* If pending, we don't link to write page. If draft, we link to write page. */}
                          <Link href={draft.status === 'draft' ? `/dashboard/write?id=${draft._id}` : '#'} className="absolute inset-0 z-0"></Link>
                          
                          <div className="flex items-center justify-between mb-1 relative z-10 pointer-events-none">
                            <span className={`text-[10px] font-mono uppercase tracking-wider ${draft.status === 'pending' ? 'text-orange-400' : 'text-zinc-500'}`}>
                              {draft.status} · {draft.category || 'Uncategorized'}
                            </span>
                            <span className="text-[10px] text-zinc-600">Updated {new Date(draft.updatedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors relative z-10 pointer-events-none">
                            {draft.title || 'Untitled'}
                          </div>
                          <div className="mt-2 flex items-center justify-between relative z-10">
                            <span className="text-[10px] text-zinc-600 font-mono">{draft.wordCount || 0} words</span>
                            <div className="flex items-center gap-3">
                              {draft.status === 'draft' && (
                                <>
                                  <button onClick={(e) => handleDeleteDraft(e, draft._id)} className="text-zinc-500 hover:text-rose-400 transition-colors p-1" title="Delete draft">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="text-[10px] text-emerald-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Resume →</span>
                                </>
                              )}
                              {draft.status === 'pending' && (
                                <span className="text-[10px] text-orange-400 font-medium italic pointer-events-none">Awaiting Approval</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Top Performing Content */}
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-zinc-200">Top Performing</h3>
                    <TrendingUp className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="space-y-4">
                    {topPerforming.length === 0 ? (
                      <div className="text-xs text-zinc-500 italic p-3 text-center">No published resources yet.</div>
                    ) : (
                      topPerforming.map((pub, index) => (
                        <Link href={`/resources/${pub._id}`} key={pub._id} className="flex items-center gap-3 hover:bg-white/[0.02] p-2 rounded-lg transition-colors cursor-pointer group">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                            <span className="text-xs font-bold text-emerald-400">{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-zinc-300 truncate group-hover:text-white transition-colors">{pub.title || 'Untitled'}</div>
                            <div className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-2">
                              <span className="flex items-center gap-1">{pub.views || 0} views</span>
                              <span>·</span>
                              <span className="flex items-center gap-1">{pub.upvotes || 0} upvotes</span>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Published Content List */}
              <div className="mt-12 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200">Published Content</h3>
                  <p className="text-xs text-zinc-500 mt-1">All your live resources and their performance.</p>
                </div>
                
                <div className="space-y-3">
                  {publishedPosts.length === 0 ? (
                    <div className="text-xs text-zinc-500 italic p-4 text-center border border-white/5 rounded-xl">No published content yet.</div>
                  ) : (
                    publishedPosts.map((pub) => (
                      <Link href={`/resources/${pub._id}`} key={pub._id} className="block p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors truncate mb-1">
                              {pub.title || 'Untitled'}
                            </h4>
                            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-3">
                              {pub.content ? pub.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : 'No description provided.'}
                            </p>
                            
                            <div className="flex items-center gap-4 text-[11px] text-zinc-500">
                              <span className="text-emerald-400 font-mono">{new Date(pub.createdAt).toLocaleDateString()}</span>
                              <div className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {pub.views || 0}</div>
                              <div className="flex items-center gap-1.5"><ArrowUp className="w-3.5 h-3.5" /> {pub.upvotes || 0}</div>
                              <div className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> {pub.commentsCount || 0}</div>
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0 flex items-center gap-2">
                            <span className="px-2 py-1 rounded bg-white/5 text-[10px] font-bold text-zinc-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
                              View →
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
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
                    <input type="text" value={profile.company || ''} onChange={e => setProfile({...profile, company: e.target.value})} placeholder="e.g. Google" className="w-full bg-white/[0.03] border border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all outline-none px-3 py-2 rounded-lg text-sm text-zinc-200 font-mono" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Job Title</label>
                    <input type="text" value={profile.job_title || ''} onChange={e => setProfile({...profile, job_title: e.target.value})} placeholder="e.g. Software Engineer II" className="w-full bg-white/[0.03] border border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all outline-none px-3 py-2 rounded-lg text-sm text-zinc-200 font-mono" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Short Bio</label>
                  <textarea rows={3} value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Software Engineer at Google. Passionate about making DSA accessible..." className="w-full bg-white/[0.03] border border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all outline-none px-3 py-2 rounded-lg text-sm text-zinc-200 resize-none"></textarea>
                  <p className="text-[10px] text-zinc-600 mt-1 text-right">{profile.bio ? profile.bio.length : 0} / 160 characters</p>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button onClick={handleProfileSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-all shadow-lg disabled:opacity-50">
                    <Check className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Profile'}
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
