import React from 'react';
import { Users, Calendar, Clock, Timer, AlarmClock, Hourglass, Flame, Swords } from 'lucide-react';

export interface Contest {
  id: number;
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
  hot: boolean;
  participants: string;
  url?: string;
  category: string;
  priority: string;
  difficulty: string;
  isNonEnglish: boolean;
}

export default function DsaContestCard({ contest, index }: { contest: Contest, index: number }) {
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
        <>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">{contest.statusLabel}</span>
          </div>
        </>
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
      className={`contest-card glass rounded-xl overflow-hidden animate-in transition-all duration-300 ${contest.priority === 'Hot' ? 'border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.15)] hover:shadow-[0_0_30px_rgba(249,115,22,0.25)] ring-1 ring-orange-500/20' : ''}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div 
              className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider" 
              style={{
                background: contest.platformBg,
                color: contest.platformColor,
                border: `1px solid ${contest.platformBorder}`
              }}
            >
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
            {contest.participants}
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
                {contest.difficulty === 'Beginner' ? '🟢 Beginner' :
                 contest.difficulty === 'Intermediate' ? '🟡 Intermediate' : '🔴 Advanced'}
              </span>
            </>
          )}
        </div>

        <h3 className="text-base font-medium mb-3 leading-snug">{contest.title}</h3>

        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            {contest.date}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            {contest.time}
          </div>
          <div className={`flex items-center gap-2 text-xs ${getDurationColor()}`}>
            {getDurationIcon()}
            {contest.duration}
          </div>
        </div>

        <button 
          onClick={() => window.open(contest.url, '_blank')} 
          className="crack-btn w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 hover:bg-white hover:text-zinc-900 transition-all"
        >
          <Swords className="w-3.5 h-3.5" />
          Crack this!
        </button>
      </div>
    </div>
  );
}
