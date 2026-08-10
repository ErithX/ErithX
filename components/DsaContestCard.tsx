import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Users, Clock, Swords, BookOpen, CalendarPlus, Trophy } from 'lucide-react';
import { getFakeParticipantCount } from '@/app/utils/participants/generator';

export interface Contest {
  id: number;
  platform: string; 
  logo: string;     
  title: string;
  status: 'live' | 'today' | 'upcoming';
  statusLabel: string;
  startDate: string; 
  time: string;      
  duration: number;  
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  isRecommended: boolean;
  participants: string;
  url: string;
  platformColor?: string;
  category?: string;
  difficulty?: string;
  priority?: string;
}

const PlatformLogo = ({ url, platformName }: { url: string, platformName: string }) => {
  const [error, setError] = useState(false);

  if (error || !url) {
    return <Trophy className="w-4 h-4 text-zinc-400" />;
  }

  return (
    <Image 
      src={url} 
      alt={`${platformName} logo`}
      width={16}
      height={16}
      className="w-full h-full object-contain"
      onError={() => setError(true)}
    />
  );
};

export default function DsaContestCard({ contest, index }: { contest: Contest, index: number }) {
  const timerRef = useRef<HTMLDivElement>(null);

  const formatPlatformName = (host: string) => {
    return host
      .replace('naukri.com/', '') 
      .replace('.com', '')
      .replace('.org', '')
      .replace(/\b\w/g, char => char.toUpperCase()); 
  };

  const generateGcalLink = () => {
    const startDate = new Date(contest.startDate);
    const endDate = new Date(startDate.getTime() + contest.duration * 60000);
    const format = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const text = encodeURIComponent(`${formatPlatformName(contest.platform)} ${contest.title}`);
    const dates = `${format(startDate)}/${format(endDate)}`;
    const details = encodeURIComponent(`Join the contest: ${contest.url}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}`;
  };

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
        timerRef.current.innerText = `${days}d ${String(hours).padStart(2, '0')}h`;
      } else if (hours > 0) {
        timerRef.current.innerText = `${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`;
      } else {
        timerRef.current.innerText = `${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
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

  const participantCount = (!contest.participants || contest.participants === '-') 
    ? getFakeParticipantCount(contest.id || contest.title) 
    : contest.participants;

  return (
    <div 
      className="contest-card glass rounded-xl overflow-hidden animate-in relative flex flex-col h-full"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="p-5 flex-1 flex flex-col">
        {/* Top Row: Platform Logo & Name + Status (Left) and Recommended/Participants (Right) */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-white/5 flex items-center justify-center overflow-hidden p-0.5">
              <PlatformLogo url={contest.logo} platformName={formatPlatformName(contest.platform)} />
            </div>
            <span className="text-[11px] font-medium text-zinc-300 capitalize">
              {formatPlatformName(contest.platform)}
            </span>
            {getStatusBadge()}
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {contest.isRecommended && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-400">⭐ REC</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-[10px] text-zinc-600">
              <Users className="w-3 h-3" />
              {participantCount}
            </div>
          </div>
        </div>

        {/* Old Beginner (Level) Tag */}
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400 font-medium">
          <span>{formatPlatformName(contest.platform)} Contest</span>
          <>
            <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
            <span className={
              contest.level === 'Beginner' ? 'text-emerald-400' :
              contest.level === 'Intermediate' ? 'text-yellow-400' : 'text-red-400'
            }>
              {contest.level}
            </span>
          </>
        </div>

        {/* Title */}
        <h3 className="text-base font-medium mb-4 flex-1 leading-snug">{contest.title}</h3>

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
        <div className="flex items-center gap-2 mt-auto">
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
