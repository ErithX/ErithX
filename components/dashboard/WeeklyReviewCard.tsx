"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2, AlertTriangle, Target, Bot } from 'lucide-react';

interface LatestReviewData {
  _id: string;
  generated_text: string;
  targets_set: string;
  model_used: string;
  roy_factor: number;
  created_at: string;
  stats_snapshot?: any;
}

export default function WeeklyReviewCard() {
  const [review, setReview] = useState<LatestReviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch('/api/user/reviews/latest');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.review) {
            setReview(data.review);
          }
        }
      } catch (err) {
        console.error('Failed to load review preview:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLatest();
  }, []);

  const getMoodBadge = (royFactor: number) => {
    if (royFactor === 0) {
      return {
        label: 'Mentor: On Track',
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        icon: CheckCircle2,
      };
    }
    if (royFactor === 1) {
      return {
        label: 'Mentor: Warning Active',
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        icon: AlertTriangle,
      };
    }
    return {
      label: 'Mentor: Critical Slacking',
      color: 'bg-red-500/10 text-red-400 border-red-500/20',
      icon: ShieldAlert,
    };
  };

  const badge = getMoodBadge(review?.roy_factor ?? 0);
  const BadgeIcon = badge.icon;

  const reviewDate = review?.created_at
    ? new Date(review.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent Week';

  return (
    <div className="glass rounded-2xl p-6 relative overflow-hidden border border-white/10 group hover:border-emerald-500/30 transition-all duration-300">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:bg-emerald-500/10 transition-colors" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide">
              Weekly AI Mentor Review
            </h2>
            <div className="text-[11px] text-zinc-400 flex items-center gap-2">
              <span>{reviewDate}</span>
              {review?.model_used && (
                <>
                  <span>•</span>
                  <span className="text-zinc-500 font-mono text-[10px]">{review.model_used}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mentor Status Badge */}
        <div className={`px-2.5 py-1 rounded-full text-[11px] font-medium border flex items-center gap-1.5 ${badge.color}`}>
          <BadgeIcon className="w-3.5 h-3.5" />
          <span>{badge.label}</span>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-zinc-500 animate-pulse">
          Loading your latest weekly report...
        </div>
      ) : review ? (
        <div className="space-y-4 relative z-10">
          {/* Review Snippet */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
              "{review.generated_text}"
            </p>
          </div>

          {/* Target Highlight */}
          {review.targets_set && (
            <div className="p-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/15 flex items-start gap-2.5">
              <Target className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-emerald-300">Active Focus: </span>
                <span className="text-zinc-300">{review.targets_set}</span>
              </div>
            </div>
          )}

          {/* Prominent Action Button to Full Reports */}
          <div className="pt-1 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500">
              Unfiltered senior engineer feedback & targets
            </span>
            <Link
              href="/dashboard/reports"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 text-xs font-semibold hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] transition-all"
            >
              <span>Open Full Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="p-6 rounded-xl bg-white/[0.01] border border-dashed border-white/10 text-center space-y-3 relative z-10">
          <Sparkles className="w-6 h-6 text-zinc-500 mx-auto" />
          <div className="text-xs text-zinc-300 font-medium">No Weekly Report Generated Yet</div>
          <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
            Connect your LeetCode or GitHub handles to unlock automated, brutally honest weekly progress reviews.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/reports"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-white/10 transition-colors"
            >
              View Reports Hub
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
