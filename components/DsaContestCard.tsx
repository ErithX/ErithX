import React from 'react';
import Image from 'next/image';
import { Users, Calendar as CalendarIcon, Clock, Timer, AlarmClock, Hourglass, Flame, Swords, CalendarPlus, Trophy } from 'lucide-react';
import { getFakeParticipantCount } from '@/app/utils/participants/generator';
import { useGlobalClock } from '@/hooks/useGlobalClock';

export interface Contest {
  id: number | string;
  platform: string;
  platformColor: string;
  platformBg: string;
  platformBorder: string;
  title: string;
  status: 'live' | 'today' | 'upcoming';
  statusLabel: string;
  date: string;
  time: string;
  duration: string;
  rawStartTime?: string;
  rawDurationSeconds?: number;
  hot: boolean;
  participants: string;
  url?: string;
  category: string;
  priority: string;
  priorityScore?: number;
  difficulty: string;
  isNonEnglish: boolean;
}

const getSmartCountdown = (now: number | null, startStr?: string, durSecs?: number) => {
  if (!now || !startStr || !durSecs) return null;
  const startMs = new Date(startStr).getTime();
  const endMs = startMs + durSecs * 1000;
  
  if (now > endMs) return 'Ended';
  
  if (now >= startMs && now <= endMs) {
    // Live
    const remaining = Math.max(0, endMs - now);
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    if (h > 0) return `Ends in ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `Ends in ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  
  // Upcoming
  const diff = startMs - now;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  
  if (days > 1) return `Starts in ${days}d ${hours}h`;
  if (days === 1 || hours > 0) {
    const totalHours = days * 24 + hours;
    return `Starts in ${totalHours}h ${minutes}m`;
  }
  
  // Less than 1 hour -> imminent (show seconds)
  return `Starts in ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
};

const generateGoogleCalendarUrl = (contest: Contest) => {
  if (!contest.rawStartTime || !contest.rawDurationSeconds) return '#';
  const start = new Date(contest.rawStartTime);
  const end = new Date(start.getTime() + contest.rawDurationSeconds * 1000);
  const formatTime = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  const text = encodeURIComponent(`${contest.platform} - ${contest.title}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${formatTime(start)}/${formatTime(end)}`;
};

const PlatformLogo = ({ contest }: { contest: Contest }) => {
  const [error, setError] = React.useState(false);

  if (error) {
    return <Trophy className="w-3.5 h-3.5 text-zinc-400" />;
  }

  let domain = 'google.com';
  if (contest.url) {
    try {
      domain = new URL(contest.url).hostname;
    } catch (e) {}
  } else {
    domain = `${contest.platform.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  }

  return (
    <Image 
      src={`https://s2.googleusercontent.com/s2/favicons?domain=${domain}&sz=64`} 
      alt={`${contest.platform} Coding Contest Platform Logo - DSA Quest`}
      title={`View ${contest.platform} Contests`}
      width={14}
      height={14}
      className="object-contain rounded-sm"
      onError={() => setError(true)}
    />
  );
};

export default function DsaContestCard({ contest, index }: { contest: Contest, index: number }) {
  const now = useGlobalClock();
  const smartCountdown = getSmartCountdown(now, contest.rawStartTime, contest.rawDurationSeconds);
  const isEnded = smartCountdown === 'Ended';

  const getStatusBadge = () => {
    if (isEnded) {
      return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-500/10 border border-zinc-500/20">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Ended</span>
        </div>
      );
    }
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

  const getDurationIcon = () => {
    if (contest.status === 'live') return <Timer className="w-3.5 h-3.5" />;
    if (contest.status === 'today') return <AlarmClock className="w-3.5 h-3.5" />;
    return <Hourglass className="w-3.5 h-3.5" />;
  };

  const getDurationColor = () => {
    if (contest.status === 'live') return 'text-red-400';
    if (contest.status === 'today') return 'text-emerald-400';
    return 'text-zinc-500';
  };

  return (
    <div 
      className={`contest-card glass rounded-xl overflow-hidden animate-in transition-all duration-300 flex flex-col h-full ${contest.priority === 'Hot' ? 'border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.15)] hover:shadow-[0_0_30px_rgba(249,115,22,0.25)] ring-1 ring-orange-500/20' : ''}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div 
              className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider" 
              style={{
                background: contest.platformBg,
                color: contest.platformColor,
                border: `1px solid ${contest.platformBorder}`
              }}
            >
              <PlatformLogo contest={contest} />
              {contest.platform}
            </div>
            {getStatusBadge()}
            {contest.priority === 'Hot' && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                <Flame className="w-2.5 h-2.5 text-orange-400" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-orange-400">HOT</span>
              </div>
            )}
            {contest.priority === 'Recommended' && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-400">⭐ REC</span>
              </div>
            )}
            {contest.isNonEnglish && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20" title="Non-English">
                <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400">🌐 Non-EN</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-zinc-600 ml-2 shrink-0">
            <Users className="w-3 h-3" />
            {(!contest.participants || contest.participants === '-') ? getFakeParticipantCount(contest.id || contest.title) : contest.participants}
          </div>
        </div>

        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400 font-medium">
          <span>{contest.category}</span>
          {contest.difficulty !== 'Unknown' && (
            <>
              <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
              <span className={
                contest.difficulty === 'Beginner' ? 'text-emerald-400' :
                contest.difficulty === 'Intermediate' ? 'text-yellow-400' : 'text-red-400'
              }>
                {contest.difficulty === 'Beginner' ? 'Beginner' :
                 contest.difficulty === 'Intermediate' ? 'Intermediate' : 'Advanced'}
              </span>
            </>
          )}
        </div>

        <h3 className="text-base font-medium mb-3 leading-snug flex-1">{contest.title}</h3>

        <div className="space-y-2 mb-5">
          {smartCountdown ? (
            <div className={`flex items-center gap-2 text-xs font-bold ${contest.status === 'live' ? 'text-red-400' : 'text-emerald-400'}`}>
              <Timer className="w-3.5 h-3.5" />
              {smartCountdown}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <CalendarIcon className="w-3.5 h-3.5 text-zinc-500" />
                {contest.date}
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                {contest.time}
              </div>
            </>
          )}
          <div className={`flex items-center gap-2 text-xs ${getDurationColor()}`}>
            {getDurationIcon()}
            {contest.duration}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <button 
            onClick={() => window.open(contest.url, '_blank')} 
            className={`crack-btn flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-medium transition-all ${
              isEnded 
                ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white' 
                : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white hover:text-zinc-900'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            {isEnded ? 'View Solutions' : 'Crack this!'}
          </button>
          
          {!isEnded && contest.rawStartTime && (
            <button
              onClick={() => window.open(generateGoogleCalendarUrl(contest), '_blank')}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
              title="Add to Google Calendar"
            >
              <CalendarPlus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
