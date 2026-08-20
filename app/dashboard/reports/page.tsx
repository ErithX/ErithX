"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Search, MoreHorizontal, ShieldAlert, Lock, Sparkles, X, ArrowLeft } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

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
  short_summary?: string;
  next_roadmap?: string;
}

const DesktopTimeline = ({ reviews, selected, onSelect, onSearchDate }: { reviews: ReviewItem[], selected: ReviewItem, onSelect: (r: ReviewItem) => void, onSearchDate: (date: string) => void }) => {
  return (
    <nav className="timeline-nav hidden xl:flex flex-col items-center justify-between">
      <div className="timeline-line"></div>
      <div className="relative mb-4 z-10 group">
        <button className="text-zinc-500 hover:text-white transition-colors p-1.5 rounded-full" title="Search Custom Date">
          <Search className="w-4 h-4" />
        </button>
        <input 
          type="date" 
          onChange={(e) => { if(e.target.value) onSearchDate(e.target.value); }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex flex-col gap-6 items-center bg-[#09090b] py-4 px-1 rounded-full max-h-[50vh] overflow-y-auto scrollbar-none">
        {reviews.slice(0, 24).map((r, i) => {
          const isCurrent = r._id === selected._id;
          const isMissed = r.roy_factor > 0;
          const statusText = r.roy_factor === 0 ? '(On track)' : (r.roy_factor === 1 ? '(Mild drift)' : '(Targets missed)');
          const dateStr = new Date(r.week_start_date || r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const displayTitle = r.short_summary || `Week ${reviews.length - i}`;
          let dotClass = "timeline-dot";
          if (isCurrent) dotClass += " active";
          else if (isMissed) dotClass += " missed";

          return (
            <div key={r._id} className={dotClass} onClick={() => onSelect(r)} title={`${displayTitle} • ${dateStr} ${statusText}`}>
              <div className="timeline-tooltip">{displayTitle} • {dateStr} <span className="text-zinc-500 ml-1">{statusText}</span></div>
            </div>
          );
        })}
      </div>
      <button className="text-zinc-600 hover:text-zinc-400 transition-colors mt-4 z-10 bg-[#09090b] p-1 rounded-full" title="Report Settings">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </nav>
  );
};

const MobileTimeline = ({ reviews, selected, onSelect, onSearchDate }: { reviews: ReviewItem[], selected: ReviewItem, onSelect: (r: ReviewItem) => void, onSearchDate: (date: string) => void }) => (
  <div className="xl:hidden mb-8">
    <div className="flex justify-between items-center mb-4">
      <span className="text-[10px] uppercase tracking-widest text-zinc-500">History</span>
      <div className="relative">
        <button className="text-zinc-500 hover:text-white transition-colors p-1.5 rounded-full border border-white/5">
          <Search className="w-3.5 h-3.5" />
        </button>
        <input 
          type="date" 
          onChange={(e) => { if(e.target.value) onSearchDate(e.target.value); }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
    <div className="mobile-timeline">
      {reviews.slice(0, 12).map((r, i) => {
          const isCurrent = r._id === selected._id;
          const isMissed = r.roy_factor > 0;
          let dotClass = "mobile-dot";
          if (isCurrent) dotClass += " active";
          else if (isMissed) dotClass += " missed";
          const statusText = r.roy_factor === 0 ? 'On track' : (r.roy_factor === 1 ? 'Mild drift' : 'Targets missed');
          const dateStr = new Date(r.week_start_date || r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const displayTitle = r.short_summary || `Week ${reviews.length - i}`;
          return (
            <div 
              key={r._id} 
              className={dotClass} 
              onClick={() => onSelect(r)}
              title={`${displayTitle} • ${dateStr} (${statusText})`}
            ></div>
          );
      })}
    </div>
  </div>
);

const getWarningConfig = (roy_factor: number) => {
  if (roy_factor === 1) return {
    title: "Mild Drift Detected",
    text: "You missed some targets this week. Try to realign next week.",
    style: "border-amber-500/20 bg-amber-500/5",
    iconStyle: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    titleStyle: "text-amber-300"
  };
  if (roy_factor === 2) return {
    title: "Attention Needed",
    text: "You've missed targets for 2 weeks. Continued drift will affect your review privileges.",
    style: "border-orange-500/20 bg-orange-500/5",
    iconStyle: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    titleStyle: "text-orange-300"
  };
  if (roy_factor === 3) return {
    title: "Review Privilege At Risk",
    text: "System detected repeated deviation from goals. One more miss may suspend AI Review privileges.",
    style: "border-red-500/20 bg-red-500/5",
    iconStyle: "bg-red-500/10 border-red-500/20 text-red-400",
    titleStyle: "text-red-300"
  };
  if (roy_factor >= 4) return {
    title: "Privileges Suspended",
    text: "AI Review has been paused due to continuous deviation. Request reactivation to continue.",
    style: "border-red-500/30 bg-red-500/10",
    iconStyle: "bg-red-500/20 border-red-500/30 text-red-500",
    titleStyle: "text-red-400 font-bold"
  };
  return null;
};

const WarningBanner = ({ review }: { review: ReviewItem }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, [review._id]);

  const config = getWarningConfig(review.roy_factor);
  if (!isVisible || !config) return null;

  return (
    <div className="mb-12">
      <div className={`glass ${config.style} rounded-xl p-4 flex items-start gap-3 relative`}>
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-white/30 hover:text-white/60 transition-opacity p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 ${config.iconStyle}`}>
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div className="pr-4">
          <h4 className={`text-xs font-medium mb-1 ${config.titleStyle}`}>
            {config.title}
          </h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
             {config.text}
          </p>
        </div>
      </div>
    </div>
  );
};

const ReportHeader = ({ review, reviews, selectedIndex }: { review: ReviewItem, reviews: ReviewItem[], selectedIndex: number }) => {
  const weekNum = reviews.length - selectedIndex;
  
  // 8 week momentum calculation (we take the first 8 items which are the most recent 8 weeks, and reverse to show oldest to newest left to right)
  const momentumWeeks = reviews.slice(0, 8).reverse();
  const activeCount = momentumWeeks.filter(r => r.roy_factor === 0).length;

  return (
    <header className="border-b border-white/5 pb-10 mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-10">
        <div>
          <div className="text-xs text-zinc-500 mb-2 tracking-wide">Week {weekNum} Report</div>
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-white">Momentum & Mastery</h1>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1">Global Percentile</div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl md:text-5xl font-light bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Top 3</span>
            <span className="text-xl md:text-2xl font-light text-zinc-400">%</span>
          </div>
          {/* <div className="text-[10px] text-zinc-600 mt-1">Out of 48,210 active peers</div> */}
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">8-Week Consistency</span>
          <span className="text-[10px] text-zinc-400 font-medium">{activeCount} of 8 weeks on track</span>
        </div>
        <div className="grid grid-cols-8 gap-1.5 md:gap-2">
          {[0,1,2,3,4,5,6,7].map(i => {
            const r = momentumWeeks[i];
            let segClass = '';
            let titleText = 'No Data';
            if (r) {
              if (r.roy_factor === 0) { segClass = 'active'; titleText = 'Perfect Week'; }
              else if (r.roy_factor === 1) { segClass = 'partial'; titleText = 'Mild Drift'; }
              else if (r.roy_factor >= 2) { segClass = 'missed'; titleText = 'Missed Targets'; }
            }
            return (
              <div key={i} className={`momentum-seg ${segClass}`} title={titleText}></div>
            );
          })}
        </div>
      </div>
    </header>
  );
};

const ReportBody = ({ review }: { review: ReviewItem }) => {
  const paragraphs = review.generated_text
    ? review.generated_text.split('\n').filter(p => p.trim().length > 0).map(p => p.replace(/\*\*/g, '').replace(/\*/g, ''))
    : ["No insights generated for this week."];

  return (
    <article className="reading-text mb-16">
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </article>
  );
};

const NextStepsPremium = ({ review, tier }: { review: ReviewItem, tier: string }) => {
  const isPremium = tier === 'pro' || tier === 'lifetime';

  return (
    <section className="border-t border-white/5 pt-10">
      <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 mb-6">Your Next Move</div>
      <div className="glass rounded-xl p-6 md:p-8 relative overflow-hidden transition-all min-h-[220px]">
        
        <div className={isPremium ? "" : "blur-premium"}>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
            <h3 className="text-lg font-medium text-white">Focus Area & Targets</h3>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">Target Logged</span>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed mb-8 max-w-xl whitespace-pre-wrap">
            {review.targets_set || "No targets logged for this week."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white text-zinc-900 text-xs font-semibold hover:bg-zinc-200 transition-all">
              Acknowledge Goal
            </button>
          </div>
        </div>

        {!isPremium && (
          <div className="absolute inset-0 premium-overlay flex flex-col items-center justify-center text-center p-8 z-10">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5 text-zinc-400" />
            </div>
            <h4 className="text-base font-medium text-white mb-2">Unlock Your Optimized Path</h4>
            <p className="text-xs text-zinc-500 max-w-xs mb-5">
              Upgrade to Premium to reveal AI-curated next steps, custom problem sets, and targeted roadmaps based on this report.
            </p>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-900 text-xs font-bold hover:opacity-90 transition-all">
              <Sparkles className="w-3.5 h-3.5" />
              Unlock Premium
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

function ReportsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();

  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [loading, setLoading] = useState(true);

  const targetDate = searchParams.get('date');
  const targetId = searchParams.get('id');

  useEffect(() => {
    async function loadReports() {
      if (!user) return;
      try {
        setLoading(true);

        const cached = sessionStorage.getItem('dashboard_reviews_cache');
        if (cached) {
          const data = JSON.parse(cached);
          if (data && data.reviews && data.reviews.length > 0) {
            setReviewsList(data.reviews);
            let target = data.reviews[0];
            if (targetId) {
              const f = data.reviews.find((r: ReviewItem) => r._id === targetId);
              if (f) target = f;
            } else if (targetDate) {
              const f = data.reviews.find((r: ReviewItem) => new Date(r.week_start_date || r.created_at).toISOString().startsWith(targetDate));
              if (f) target = f;
            }
            setSelectedReview(target);
            setLoading(false);
            return;
          }
        }

        const res = await fetch('/api/user/reviews');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.reviews && data.reviews.length > 0) {
            sessionStorage.setItem('dashboard_reviews_cache', JSON.stringify(data));
            setReviewsList(data.reviews);
            
            let target = data.reviews[0];
            if (targetId) {
              const f = data.reviews.find((r: ReviewItem) => r._id === targetId);
              if (f) target = f;
            } else if (targetDate) {
              const f = data.reviews.find((r: ReviewItem) => new Date(r.week_start_date || r.created_at).toISOString().startsWith(targetDate));
              if (f) target = f;
            }
            setSelectedReview(target);
          }
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [user, targetId, targetDate]);

  const selectReport = (r: ReviewItem) => {
    setSelectedReview(r);
    const dateStr = (r.week_start_date || r.created_at).slice(0, 10);
    router.push(`/dashboard/reports?date=${dateStr}`, { scroll: false });
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!selectedReview) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-8">
        <div className="glass p-8 rounded-2xl flex flex-col items-center max-w-sm text-center">
          <ShieldAlert className="w-8 h-8 text-zinc-500 mb-4" />
          <h2 className="text-lg font-medium mb-2">No Reports Yet</h2>
          <p className="text-xs text-zinc-400">Complete your weekly tasks to generate your first AI Mentor Review.</p>
        </div>
      </div>
    );
  }

  const selectedIndex = reviewsList.findIndex(r => r._id === selectedReview._id);

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-zinc-800 selection:text-white font-sans grid-bg relative overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        .timeline-nav {
          position: fixed; left: 80px; top: 50%; transform: translateY(-50%);
          height: 60vh; z-index: 50;
        }
        .timeline-line {
          position: absolute; top: 0; bottom: 0; left: 50%;
          width: 1px; background: rgba(255,255,255,0.1);
          transform: translateX(-50%); z-index: -1;
        }
        .timeline-dot {
          width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.2);
          border: 2px solid #09090b; cursor: pointer; transition: all 0.2s ease; position: relative;
        }
        .timeline-dot:hover { background: #34d399; transform: scale(1.4); box-shadow: 0 0 12px rgba(16,185,129,0.6); }
        .timeline-dot.active { background: #10b981; transform: scale(1.6); box-shadow: 0 0 16px rgba(16,185,129,0.8); }
        .timeline-dot.missed { background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.1); }
        .timeline-tooltip {
          position: absolute; left: 24px; top: 50%; transform: translateY(-50%);
          background: #18181b; border: 1px solid rgba(255,255,255,0.1);
          padding: 6px 12px; border-radius: 6px; font-size: 10px;
          white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s ease;
        }
        .timeline-dot:hover .timeline-tooltip { opacity: 1; }
        .mobile-timeline {
          display: flex; align-items: center; gap: 16px; overflow-x: auto;
          padding-bottom: 12px; scrollbar-width: none;
        }
        .mobile-timeline::-webkit-scrollbar { display: none; }
        .mobile-dot {
          width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.2);
          border: 2px solid #09090b; flex-shrink: 0;
        }
        .mobile-dot.active { background: #10b981; box-shadow: 0 0 10px rgba(16,185,129,0.6); }
        .mobile-dot.missed { background: rgba(239, 68, 68, 0.2); }
        .momentum-seg {
          height: 6px; border-radius: 3px; background: rgba(255,255,255,0.03); transition: all 0.3s ease;
        }
        .momentum-seg.active {
          background: linear-gradient(to right, #10b981, #34d399);
          box-shadow: 0 0 12px rgba(16,185,129,0.4);
        }
        .momentum-seg.partial {
          background: linear-gradient(to right, rgba(245, 158, 11, 0.6), rgba(16, 185, 129, 0.4));
          box-shadow: 0 0 8px rgba(245, 158, 11, 0.2);
        }
        .momentum-seg.missed {
          background: rgba(255, 255, 255, 0.03);
        }
        .reading-text p {
          margin-bottom: 1.75rem; line-height: 1.8; font-size: 1.0625rem;
          color: #d4d4d8; font-weight: 400; letter-spacing: -0.01em;
        }
        .reading-text p:first-child::first-letter { color: #fff; font-weight: 600; }
        .blur-premium { filter: blur(5px); pointer-events: none; user-select: none; }
        .premium-overlay { background: rgba(9,9,11,0.4); backdrop-filter: blur(8px); }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        .aurora-bg {
          position: fixed; top: -10%; left: -10%; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%);
          filter: blur(80px); z-index: 0; pointer-events: none;
        }
        .aurora-bg-2 {
          position: fixed; bottom: -10%; right: -10%; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(34,211,238,0.12), transparent 70%);
          filter: blur(80px); z-index: 0; pointer-events: none;
        }
        .glass { 
          background: rgba(9,9,11,0.6); backdrop-filter: blur(16px); 
          -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.08); 
        }
        .glass:hover { background: rgba(9,9,11,0.7); }
        .grid-bg { 
          background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); 
          background-size: 32px 32px; z-index: 0; position: relative;
        }
      `}} />

      <div className="aurora-bg"></div>
      <div className="aurora-bg-2"></div>

      <DesktopTimeline reviews={reviewsList} selected={selectedReview} onSelect={selectReport} onSearchDate={(date) => router.push(`/dashboard/reports?date=${date}`)} />

      <main className="relative pt-6 md:pt-12 pb-20 z-10">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          
          {/* Mobile Back to Dashboard */}
          <button 
            onClick={() => router.push('/dashboard')}
            className="xl:hidden flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-medium mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <MobileTimeline reviews={reviewsList} selected={selectedReview} onSelect={selectReport} onSearchDate={(date) => router.push(`/dashboard/reports?date=${date}`)} />
          <ReportHeader review={selectedReview} reviews={reviewsList} selectedIndex={selectedIndex} />
          <WarningBanner review={selectedReview} />
          <ReportBody review={selectedReview} />
          <NextStepsPremium review={selectedReview} tier={user?.tier || 'free'} />
        </div>
      </main>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    }>
      <ReportsContent />
    </Suspense>
  );
}
