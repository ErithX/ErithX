"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Bot, 
  Calendar, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Target, 
  Sparkles, 
  Clock, 
  Zap, 
  History,
  CheckSquare,
  Square,
  Activity,
  Layers,
  ChevronLeft
} from 'lucide-react';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { useAuthStore } from '@/store/authStore';
import { createClient } from '@/app/lib/supabase/client';

interface ReviewItem {
  _id: string;
  user_id: string;
  generated_text: string;
  targets_set: string;
  previous_targets?: string;
  model_used: string;
  roy_factor: number;
  stats_snapshot?: any;
  week_start_date?: string;
  created_at: string;
}

function ReportsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const supabase = createClient();

  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [checkedTargets, setCheckedTargets] = useState<Record<string, boolean>>({});

  const targetDate = searchParams.get('date');
  const targetId = searchParams.get('id');

  // 1. Fetch all reports for the user
  useEffect(() => {
    async function loadReports() {
      if (!user) return;
      try {
        setLoading(true);
        const res = await fetch('/api/user/reviews');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.reviews) {
            setReviewsList(data.reviews);

            // Select matching report or fallback to latest
            if (targetId) {
              const matched = data.reviews.find((r: ReviewItem) => r._id === targetId);
              setSelectedReview(matched || data.reviews[0] || null);
            } else if (targetDate) {
              const matched = data.reviews.find((r: ReviewItem) => {
                const d = (r.week_start_date || r.created_at).slice(0, 10);
                return d === targetDate;
              });
              setSelectedReview(matched || data.reviews[0] || null);
            } else {
              setSelectedReview(data.reviews[0] || null);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      loadReports();
    }
  }, [user, authLoading, targetId, targetDate]);

  const selectReport = (r: ReviewItem) => {
    setSelectedReview(r);
    const dateStr = (r.week_start_date || r.created_at).slice(0, 10);
    router.push(`/dashboard/reports?date=${dateStr}`, { scroll: false });
    setIsSidebarOpen(false);
  };

  const toggleTargetCheck = (targetKey: string) => {
    setCheckedTargets(prev => ({
      ...prev,
      [targetKey]: !prev[targetKey]
    }));
  };

  // Mentor Mood Visual Configuration
  const getMentorMood = (royFactor: number) => {
    if (royFactor === 0) {
      return {
        title: "Focused & Demanding",
        sub: "Zero fluff. Expecting continuous hard solves.",
        themeColor: "emerald",
        badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        avatarBg: "from-emerald-950/60 to-zinc-900",
        borderAccent: "border-emerald-500/30",
        icon: CheckCircle2,
        moodLevel: "Level 0: On Track",
        quote: "Keep your solves high quality. No vanity numbers."
      };
    }
    if (royFactor === 1) {
      return {
        title: "Stern Warning Active",
        sub: "Previous weekly targets were partially ignored.",
        themeColor: "amber",
        badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        avatarBg: "from-amber-950/60 to-zinc-900",
        borderAccent: "border-amber-500/30",
        icon: AlertTriangle,
        moodLevel: "Level 1: Warning",
        quote: "You fell short of last week's goals. Tighten up your discipline."
      };
    }
    return {
      title: "Critical Escalation",
      sub: "Multiple consecutive weeks of ignored targets.",
      themeColor: "red",
      badge: "bg-red-500/10 text-red-400 border-red-500/20",
      avatarBg: "from-red-950/60 to-zinc-900",
      borderAccent: "border-red-500/30",
      icon: ShieldAlert,
      moodLevel: "Level 2+: Slacking Alert",
      quote: "Stop wasting time. Face the hard problems head-on."
    };
  };

  const mood = getMentorMood(selectedReview?.roy_factor ?? 0);
  const MoodIcon = mood.icon;

  const formattedDate = selectedReview?.created_at
    ? new Date(selectedReview.created_at).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Navbar */}
      <DashboardNavbar 
        user={user} 
        loading={authLoading} 
        isDropdownOpen={false} 
        setIsDropdownOpen={() => {}} 
        dropdownRef={{ current: null }} 
        handleLogout={async () => {
          await supabase.auth.signOut();
          window.location.href = '/';
        }} 
      />

      {/* Main Container */}
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1 relative">
        
        {/* Top Breadcrumb Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard"
              className="w-9 h-9 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Link href="/dashboard" className="hover:text-zinc-300 transition-colors">Dashboard</Link>
                <span>/</span>
                <span className="text-zinc-300">Weekly Reports</span>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
                AI Mentor Review & Growth Log
              </h1>
            </div>
          </div>

          {/* Right Action / Toggle History */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-all shadow-sm"
          >
            <History className="w-3.5 h-3.5 text-emerald-400" />
            <span>Past Reports ({reviewsList.length})</span>
            <ChevronRight className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${isSidebarOpen ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-zinc-400 font-mono">Loading weekly reports archive...</p>
          </div>
        ) : !selectedReview ? (
          /* Empty State */
          <div className="py-20 max-w-xl mx-auto text-center space-y-4 p-8 rounded-2xl bg-white/[0.02] border border-white/10">
            <Bot className="w-12 h-12 text-zinc-600 mx-auto" />
            <h2 className="text-base font-semibold text-white">No Reports Generated Yet</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Once you connect your LeetCode, GitHub, or Codeforces accounts and the weekly snapshot runs, your Senior Engineer AI mentor will generate brutally honest, personalized feedback and assigned targets here.
            </p>
            <div className="pt-2">
              <Link 
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 text-xs font-semibold hover:bg-emerald-400 transition-colors"
              >
                Connect Profiles on Dashboard
              </Link>
            </div>
          </div>
        ) : (
          /* Main Two-Column Reading Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Report Reader (Satisfying Typography) (Col 8) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Report Header Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>{formattedDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-zinc-800 text-zinc-300 border border-white/10">
                      Model: {selectedReview.model_used || 'llama-3.3-70b'}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium border flex items-center gap-1.5 ${mood.badge}`}>
                      <MoodIcon className="w-3 h-3" />
                      <span>{mood.moodLevel}</span>
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-snug">
                  Weekly Engineering Review
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Unfiltered performance analysis, comfort-zone detection, and skill progression targets.
                </p>
              </div>

              {/* READABLE REVIEW BODY (Comfortable typography, high readability) */}
              <article className="p-8 sm:p-10 rounded-2xl bg-zinc-900/50 border border-white/10 shadow-2xl relative">
                {/* Visual accent bar */}
                <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

                <div className="prose prose-invert max-w-none">
                  {/* Formatted paragraphs with satisfying spacing */}
                  <div className="text-[15px] sm:text-[16px] text-zinc-200 leading-[1.85] font-normal tracking-wide space-y-6">
                    {selectedReview.generated_text.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="first:text-zinc-100 first:font-medium">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </article>

              {/* ACTIVE TARGETS CHECKLIST */}
              {selectedReview.targets_set && (
                <div className="p-6 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Target className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                        Mentor Assigned Targets For This Week
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Verified Next Cycle
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400">
                    Your mentor will explicitly check whether you completed these specific goals in next week's review.
                  </p>

                  <div className="space-y-2.5 pt-1">
                    {/* Interactive Target Item */}
                    <div 
                      onClick={() => toggleTargetCheck('target-1')}
                      className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 flex items-start gap-3 cursor-pointer transition-colors"
                    >
                      {checkedTargets['target-1'] ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="text-xs leading-relaxed text-zinc-200">
                        <span className="font-semibold text-emerald-300">Goal: </span>
                        <span>{selectedReview.targets_set}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Previous Targets Evaluation */}
              {selectedReview.previous_targets && (
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                    Prior Week Target Evaluated
                  </div>
                  <div className="text-xs text-zinc-300">
                    "{selectedReview.previous_targets}"
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Mentor Status, Mood Artwork & Meta (Col 4) */}
            <div className="lg:col-span-4 space-y-6">

              {/* MENTOR MOOD ARTWORK CARD */}
              <div className={`p-6 rounded-2xl bg-gradient-to-b ${mood.avatarBg} border ${mood.borderAccent} shadow-xl relative overflow-hidden`}>
                
                {/* Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Mentor Persona Status</span>
                </div>

                {/* Mood Avatar & Title */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-center text-xl shadow-inner">
                      {selectedReview.roy_factor === 0 ? '🎯' : selectedReview.roy_factor === 1 ? '⚠️' : '⚡'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {mood.title}
                      </h4>
                      <div className="text-[11px] text-zinc-400">
                        {mood.moodLevel}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed italic pt-2 border-t border-white/10">
                    "{mood.quote}"
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    {mood.sub}
                  </p>
                </div>
              </div>

              {/* QUICK SNAPSHOT METRICS OF THIS REPORT */}
              {selectedReview.stats_snapshot && (
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Analyzed Metrics Snapshot</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {selectedReview.stats_snapshot.leetcode && (
                      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-[10px] text-zinc-500">LeetCode Δ Solved</div>
                        <div className="text-sm font-bold mono text-emerald-400 mt-0.5">
                          +{selectedReview.stats_snapshot.leetcode.delta_solved_this_week ?? selectedReview.stats_snapshot.leetcode.total_solved}
                        </div>
                      </div>
                    )}
                    {selectedReview.stats_snapshot.leetcode?.current_rating && (
                      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-[10px] text-zinc-500">LC Contest Rating</div>
                        <div className="text-sm font-bold mono text-cyan-400 mt-0.5">
                          {selectedReview.stats_snapshot.leetcode.current_rating}
                        </div>
                      </div>
                    )}
                    {selectedReview.stats_snapshot.github && (
                      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-[10px] text-zinc-500">GitHub Repos</div>
                        <div className="text-sm font-bold mono text-zinc-200 mt-0.5">
                          {selectedReview.stats_snapshot.github.public_repos || 0}
                        </div>
                      </div>
                    )}
                    {selectedReview.stats_snapshot.codeforces && (
                      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-[10px] text-zinc-500">Codeforces Rating</div>
                        <div className="text-sm font-bold mono text-purple-400 mt-0.5">
                          {selectedReview.stats_snapshot.codeforces.current_rating || selectedReview.stats_snapshot.codeforces.rating || 'Unrated'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TIMELINE QUICK SELECTOR IN SIDEBAR */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-300 font-semibold">
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Report Timeline</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">{reviewsList.length} total</span>
                </div>

                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {reviewsList.map((r, idx) => {
                    const isSelected = r._id === selectedReview._id;
                    const dateFormatted = new Date(r.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });

                    return (
                      <button
                        key={r._id}
                        onClick={() => selectReport(r)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                          isSelected 
                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-white font-medium' 
                            : 'bg-white/[0.01] hover:bg-white/[0.05] border border-transparent text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${r.roy_factor === 0 ? 'bg-emerald-400' : r.roy_factor === 1 ? 'bg-amber-400' : 'bg-red-400'}`} />
                          <span>{dateFormatted}</span>
                        </div>
                        {isSelected && <span className="text-[10px] font-mono text-emerald-400">Active</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* SLIDE-OVER DRAWER FOR PAST REVIEWS */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-md bg-zinc-950 border-l border-white/10 h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <History className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Historical Reviews Archive</h3>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2.5">
                {reviewsList.map((r) => {
                  const isSelected = r._id === selectedReview?._id;
                  const dateStr = new Date(r.created_at).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <div
                      key={r._id}
                      onClick={() => selectReport(r)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-white' 
                          : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/5 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-white">{dateStr}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          r.roy_factor === 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          r.roy_factor === 1 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          Level {r.roy_factor}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                        "{r.generated_text}"
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 text-center text-xs text-zinc-500">
              Pro members have permanent unlimited review archives.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-500 text-xs font-mono">
        Loading Reports Sanctuary...
      </div>
    }>
      <ReportsContent />
    </Suspense>
  );
}
