import React, { useEffect, useRef } from 'react';
import { Users, Clock, Flame, Swords, BookOpen, CalendarPlus } from 'lucide-react';

export interface Contest {
  id: number;
  platform: string; // e.g., 'naukri.com/code360'
  logo: string;     // URL to platform favicon/logo
  title: string;
  status: 'live' | 'today' | 'upcoming';
  statusLabel: string;
  startDate: string; // ISO string for accurate countdown
  time: string;      // Formatted time string (e.g., "8:00 PM IST")
  duration: number;  // in minutes
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  isRecommended: boolean;
  participants: string;
  url: string;
}

export default function DsaContestCard({ contest, index }: { contest: Contest, index: number }) {
  const timerRef = useRef<HTMLDivElement>(null);

  // Helper to clean up platform names for display
  const formatPlatformName = (host: string) => {
    return host
      .replace('naukri.com/', '') // Special case for Code360
      .replace('.com', '')
      .replace('.org', '')
      .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize words
  };

  // Helper to generate Google Calendar Link
  const generateGcalLink = () => {
    const startDate = new Date(contest.startDate);
    const endDate = new Date(startDate.getTime() + contest.duration * 60000);
    const format = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const text = encodeURIComponent(`${formatPlatformName(contest.platform)} ${contest.title}`);
    const dates = `${format(startDate)}/${format(endDate)}`;
    const details = encodeURIComponent(`Join the contest: ${contest.url}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}`;
  };

  // Production-level Timer Logic (Direct DOM manipulation to avoid re-renders)
  useEffect(() => {
    const updateTimer = () => {
      if (!timerRef.current) return;

      const now = new Date().getTime();
      const start = new Date(contest.startDate).getTime();
      const end = new Date(start + contest.duration * 60000).getTime();
      
      const targetDate = contest.status === 'live' ? end : start;
      const diff = targetDate - now;

      if (diff <= 0) {
        timerRef.current.innerText = "00:00:00";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        timerRef.current.innerText = `${days}d ${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`;
      } else {
        timerRef.current.innerText = `${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
      }
    };

    // Initial call to prevent flash of "--:--:--"
    updateTimer();
    
    // Setup interval
    const interval = setInterval(updateTimer, 1000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [contest.startDate, contest.duration, contest.status]);

  const getStatusBadge = () => {
    if (contest.status === 'live') {
      return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
          <span className="relative flex h-1.5 w-1.5">
            <span className="live-pulse absolute inline-flex h-full w-full rounded-full bg-red-500"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-red-400">{contest.statusLabel}</span>
        </div>
      );
    } else if (contest.status === 'today') {
      return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">{contest.statusLabel}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">{contest.statusLabel}</span>
        </div>
      );
    }
  };

  const getTimerColor = () => {
    if (contest.status === 'live') return 'text-red-400';
    if (contest.status === 'today') return 'text-emerald-400';
    return 'text-cyan-400';
  };

  const timerLabel = contest.status === 'live' ? 'Ends in' : 'Starts in';

  return (
    <div 
      className="contest-card glass rounded-xl overflow-hidden animate-in relative"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Recommended Ribbon */}
      {contest.isRecommended && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500/20 to-transparent px-3 py-1 border-l border-b border-orange-500/20 rounded-bl-lg z-10">
          <span className="text-[9px] font-bold text-orange-400 flex items-center gap-1">
            <Flame className="w-2.5 h-2.5" /> RECOMMENDED
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Top Row: Platform Logo & Name + Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-white/5 flex items-center justify-center overflow-hidden p-0.5">
              <img src={contest.logo} className="w-full h-full object-contain" alt={contest.platform} />
            </div>
            <span className="text-[11px] font-medium text-zinc-300 capitalize">
              {formatPlatformName(contest.platform)}
            </span>
          </div>
          {getStatusBadge()}
        </div>

        {/* Title & Tags */}
        <h3 className="text-base font-medium mb-2 leading-snug">{contest.title}</h3>
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-zinc-400 border border-white/5">
            {contest.level}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-zinc-400 border border-white/5 flex items-center gap-1">
            <Users className="w-2.5 h-2.5" /> {contest.participants}
          </span>
        </div>

        {/* Large Live Timer Block */}
        <div className="mb-4 p-3 rounded-lg bg-black/20 border border-white/5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] uppercase tracking-widest text-zinc-500">{timerLabel}</span>
            <span className="text-[9px] text-zinc-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {contest.time}
            </span>
          </div>
          <div 
            ref={timerRef} 
            className={`font-mono text-lg font-bold tabular-nums ${getTimerColor()}`}
          >
            --d --h --m --s
          </div>
        </div>

        {/* Action Buttons with Tooltips */}
        <div className="flex items-center gap-2">
          <a 
            href={contest.url} 
            target="_blank" 
            rel="noopener noreferrer"
            title="Participate in this contest"
            onClick={() => {
              try {
                fetch('/api/analytics/track', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    type: 'contest_platform_click', 
                    platform: contest.platform,
                    title: contest.title || (contest as any).name || '' 
                  })
                }).catch(() => {});
              } catch (e) {}
            }}
            className="crack-btn flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white text-zinc-900 text-xs font-bold hover:bg-zinc-200 transition-all"
          >
            <Swords className="w-3.5 h-3.5" />
            {contest.status === 'live' ? 'Join Now' : 'Participate'}
          </a>
          <a 
            href={generateGcalLink()} 
            target="_blank" 
            rel="noopener noreferrer"
            title="Add to Google Calendar"
            onClick={() => {
              try {
                fetch('/api/analytics/track', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    type: 'contest_calendar_sync', 
                    platform: contest.platform,
                    title: contest.title || (contest as any).name || '' 
                  })
                }).catch(() => {});
              } catch (e) {}
            }}

            className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <CalendarPlus className="w-4 h-4" />
          </a>

          <button 
            onClick={() => alert('Solutions will be available after the contest!')} 
            title="View Solutions & Editorials"
            className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}