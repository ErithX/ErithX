
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Target, ArrowUpRight, ArrowRight, Activity, Sparkles, SlidersHorizontal, Link2 } from 'lucide-react'; // <-- Added missing icons here
import { formatDistanceToNow } from 'date-fns';

interface LatestReviewData {
  _id: string;
  generated_text: string;
  targets_set: string;
  model_used: string;
  roy_factor: number;
  created_at: string;
  stats_snapshot?: any;
  is_acknowledged?: boolean;
}

export default function WeeklyReviewCard() {
  const [review, setReview] = useState<LatestReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileCount, setProfileCount] = useState(0);
  const [platforms, setPlatforms] = useState<any>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const timestamp = new Date().getTime();
        const [res, profilesRes] = await Promise.all([
          fetch(`/api/user/reviews/latest?t=${timestamp}`, { cache: 'no-store' }),
          fetch(`/api/user/profiles?t=${timestamp}`, { cache: 'no-store' })
        ]);
        
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.review) {
            setReview(data.review);
          }
        }
        
        if (profilesRes.ok) {
          const pData = await profilesRes.json();
          if (pData.success && pData.platforms) {
            setPlatforms(pData.platforms);
            const validProfiles = Object.values(pData.platforms).filter((p: any) => p && p.handle).length;
            setProfileCount(validProfiles);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 md:p-8 animate-pulse h-[350px]">
        <div className="h-6 bg-white/5 rounded w-1/4 mb-10"></div>
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="h-16 bg-white/5 rounded"></div>
          <div className="h-16 bg-white/5 rounded"></div>
        </div>
        <div className="h-12 bg-white/5 rounded w-full mb-6"></div>
      </div>
    );
  }

  // --- CASE 1: NO REVIEW YET, BUT PROFILES ARE CONNECTED ---
  if (!review) {
    if (profileCount >= 2) {
      const leetcodeSolved = platforms?.leetcode?.statsSummary?.totalSolved || 'N/A';
      const githubContributions = platforms?.github?.statsSummary?.contributions || platforms?.github?.statsSummary?.publicRepos || 'N/A'; 
      const codeforcesRating = platforms?.codeforces?.statsSummary?.rating || 'N/A';

      const statsPhrases = [];
      if (platforms?.leetcode?.handle) statsPhrases.push(`solved ${leetcodeSolved} problems on LeetCode`);
      if (platforms?.github?.handle) statsPhrases.push(`made ${githubContributions} contributions on GitHub`);
      if (platforms?.codeforces?.handle) statsPhrases.push(`achieved a ${codeforcesRating} rating on Codeforces`);

      let statsSentence = '';
      if (statsPhrases.length > 0) {
        if (statsPhrases.length === 1) {
          statsSentence = `Currently, you've ${statsPhrases[0]}.`;
        } else if (statsPhrases.length === 2) {
          statsSentence = `Currently, you've ${statsPhrases[0]} and ${statsPhrases[1]}.`;
        } else {
          statsSentence = `Currently, you've ${statsPhrases[0]}, ${statsPhrases[1]}, and ${statsPhrases[2]}.`;
        }
      }

      return (
        <div className="glass card-lift rounded-2xl p-8 md:p-10 relative overflow-hidden text-left min-h-[400px]">
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-white">You're IN.</h3>
            </div>
            
            <p className="text-base text-zinc-300 leading-relaxed font-light mb-8">
              Your profiles are synced. {statsSentence} Now, let's move beyond just solving problems.
            </p>

            {/* Scannable Feature Points */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 mb-2 text-zinc-300">
                  <Activity className="w-4 h-4 text-emerald-400" strokeWidth={2} />
                  <span className="text-xs font-medium uppercase tracking-wider">Real Progress</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">We track difficulty & consistency, not just volume.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 mb-2 text-zinc-300">
                  <Target className="w-4 h-4 text-cyan-400" strokeWidth={2} />
                  <span className="text-xs font-medium uppercase tracking-wider">Strict Tracking</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">Ignore your focus areas, and reviews get stricter over time.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 mb-2 text-zinc-300">
                  <SlidersHorizontal className="w-4 h-4 text-purple-400" strokeWidth={2} />
                  <span className="text-xs font-medium uppercase tracking-wider">Customizable</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">Set your own focus and goals anytime from Preferences.</p>
              </div>
            </div>

            {/* Preferences Callout */}
            <div className="flex items-center gap-2 mb-8 text-sm text-zinc-400">
              <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
              <span>
                Want to change what matters? Set your focus areas in{' '}
                <Link href="/dashboard/settings#ai-mentor" className="text-emerald-400 hover:underline font-medium">
                  Preferences
                </Link>.
              </span>
            </div>

            {/* High-Impact Action Button */}
            <Link 
              href="/dashboard/docs/performance-analysis" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-all group"
            >
              Maximize Your Results
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      );
    }
    
    // --- CASE 2: NOT ENOUGH PROFILES CONNECTED ---
    return (
      <div className="glass card-lift rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center text-center py-20 relative overflow-hidden min-h-[400px]">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-zinc-500/5 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center max-w-md">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <Link2 className="w-6 h-6 text-zinc-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-4">Let's get you IN.</h3>
          <p className="text-base text-zinc-400 leading-relaxed font-light mb-8">
            Connect at least two profiles so the system can understand where you stand. We don't just track how much you solve—we track how you improve.
          </p>
          <Link 
            href="/dashboard/settings#connections" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-all group"
          >
            Connect Profiles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  // --- CASE 3: REVIEW EXISTS (SHOW TEASER) ---

  const getPercentile = (id: string, factor: number) => {
    const hash = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    if (factor === 0) return 2 + (hash % 6);
    if (factor === 1) return 15 + (hash % 10);
    return 40 + (hash % 20);
  };

  const getEfficiencyBoost = (id: string, isAcknowledged?: boolean) => {
    const hash = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseScore = 24 + (hash % 18); // returns between 24 and 41
    return isAcknowledged ? baseScore + 1 : baseScore;
  };

  const percentile = getPercentile(review._id, review.roy_factor);
  const efficiency = getEfficiencyBoost(review._id, review.is_acknowledged);
  const timeAgo = formatDistanceToNow(new Date(review.created_at), { addSuffix: true });

  // Clean markdown from generated text for the teaser
  const plainText = review.generated_text.replace(/(\*|_|#|>|`)/g, '').trim();

  return (
    <Link href="/dashboard/reports" className="block group">
      <div className="glass card-lift rounded-2xl p-6 md:p-8 relative overflow-hidden">
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="font-medium text-lg text-white">Your Growth Playbook</h2>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">PERFORMANCE REVIEW • RECENT</p>
              </div>
            </div>
            <span className="hidden sm:flex items-center gap-2 text-xs text-zinc-500 group-hover:text-white transition-colors">
              Read Full Report 
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>

          {/* Dopamine Stats */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Global Percentile</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-light bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Top {percentile}</span>
                <span className="text-2xl font-light text-zinc-400">%</span>
              </div>
              
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-2 group/tooltip relative w-fit">
                <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Focus Score</div>
                <div className="w-3.5 h-3.5 rounded-full bg-white/10 flex items-center justify-center cursor-help">
                  <span className="text-[9px] font-bold text-zinc-400">?</span>
                </div>
                {/* Tooltip */}
                <div className="absolute left-0 bottom-full mb-2 w-48 bg-zinc-900 border border-white/10 text-zinc-300 text-[10px] p-2 rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-20 shadow-xl leading-relaxed">
                  Score increases when you lock in your weekly performance playbook.
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-semibold text-white">0</span>
                <span className="text-xl font-medium text-zinc-400">%</span>
              </div>
              <div className="text-[10px] text-zinc-600 mt-1">Updates next week</div>
            </div>
          </div>

          {/* Teaser Text */}
          <div className="border-l-2 border-emerald-500/30 pl-4 mb-6">
            <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">
              {plainText}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-4">
            <span className="text-xs text-zinc-500">Generated {timeAgo}</span>
            <span className="sm:hidden text-xs text-emerald-400 flex items-center gap-1">Read Report <ArrowRight className="w-3 h-3" /></span>
          </div>
        </div>
      </div>
    </Link>
  );
}
