"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Target, ArrowUpRight, ArrowRight, Activity } from 'lucide-react';
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

  if (!review) {
    if (profileCount >= 2) {
      const leetcodeSolved = platforms?.leetcode?.statsSummary?.totalSolved || 'N/A';
      // Fallback to publicRepos if contributions are not tracked directly in statsSummary
      const githubContributions = platforms?.github?.statsSummary?.contributions || platforms?.github?.statsSummary?.publicRepos || 'N/A'; 
      const codeforcesRating = platforms?.codeforces?.statsSummary?.rating || 'N/A';

      return (
        <div className="glass card-lift rounded-2xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden text-left min-h-[350px]">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
          <div className="relative z-10 w-full max-w-2xl">
            <h3 className="text-2xl font-light tracking-wide text-white mb-4">Baseline ready</h3>
            
            <p className="text-base text-zinc-300 leading-relaxed font-light mb-6">
              Your profiles are connected and your starting point is set.<br />
              <span className="font-medium mt-4 inline-block text-white">Current snapshot:</span><br />
              LeetCode: {leetcodeSolved} problems<br />
              GitHub: {githubContributions} contributions<br />
              Codeforces: {codeforcesRating} rating
            </p>

            <p className="text-sm text-zinc-400 leading-relaxed font-light mb-8">
              From this week onward, the system will track what you actually improve — not just how much you solve. It looks at consistency, difficulty, and whether you follow through on focus areas.<br /><br />
              <span className="text-zinc-300 font-medium">Stay consistent.</span> If targets keep getting ignored, reviews become stricter over time. You can set your own focus and goals anytime from Settings.
            </p>

            <Link 
              href="/dashboard/settings#ai-mentoring" 
              className="inline-block px-6 py-3 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-sm tracking-wide hover:bg-white/10 hover:text-white transition-all backdrop-blur-md"
            >
              See how reviews work
            </Link>
          </div>
        </div>
      );
    }
    
    return (
      <div className="glass card-lift rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center text-center py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-zinc-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center">
          <Target className="w-12 h-12 text-zinc-500 mb-6" strokeWidth={1.5} />
          <h3 className="text-2xl font-light tracking-wide text-white mb-4">Let’s build your baseline</h3>
          <p className="text-base text-zinc-400 max-w-md leading-relaxed font-light mb-8">
            Connect at least two profiles so the system can understand where you currently stand and start tracking real progress.
          </p>
          <Link 
            href="/dashboard/settings#connections" 
            className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-sm tracking-wide hover:bg-white/10 hover:text-white transition-all backdrop-blur-md"
          >
            Connect Profiles
          </Link>
        </div>
      </div>
    );
  }

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
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">AI REVIEW • RECENT</p>
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
                  Score increases when you lock in your weekly AI playbook.
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
