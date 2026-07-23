import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Users, ExternalLink, Trophy } from 'lucide-react';
import { Contest } from './DsaContestCard';
import { getFakeParticipantCount } from '@/app/utils/participants/generator';

const PlatformLogo = ({ url, platformName }: { url: string, platformName: string }) => {
  const [error, setError] = useState(false);

  if (error || !url) {
    return <Trophy className="w-5 h-5 text-zinc-400" />;
  }

  return (
    <Image 
      src={url} 
      alt={`${platformName} logo`}
      width={24}
      height={24}
      className="w-full h-full object-contain"
      onError={() => setError(true)}
    />
  );
};

export default function LiveContestCard({ contest, index }: { contest: Contest, index: number }) {
  const timerRef = useRef<HTMLDivElement>(null);

  const formatPlatformName = (host: string) => {
    return host
      .replace('naukri.com/', '') 
      .replace('.com', '')
      .replace('.org', '')
      .replace(/\b\w/g, char => char.toUpperCase()); 
  };

  useEffect(() => {
    const updateTimer = () => {
      if (!timerRef.current) return;

      const now = new Date().getTime();
      const end = new Date(new Date(contest.startDate).getTime() + contest.duration * 60000).getTime();
      const diff = end - now;

      if (diff <= 0) {
        timerRef.current.innerHTML = `
          <div class="flex flex-col items-center">
            <span class="text-xl md:text-2xl font-bold text-zinc-100 tracking-wider">00</span>
            <span class="text-[9px] text-zinc-500 font-medium mt-0.5">HR</span>
          </div>
          <span class="text-lg md:text-xl font-bold text-zinc-600 mt-[-15px] px-1">:</span>
          <div class="flex flex-col items-center">
            <span class="text-xl md:text-2xl font-bold text-zinc-100 tracking-wider">00</span>
            <span class="text-[9px] text-zinc-500 font-medium mt-0.5">MIN</span>
          </div>
          <span class="text-lg md:text-xl font-bold text-zinc-600 mt-[-15px] px-1">:</span>
          <div class="flex flex-col items-center">
            <span class="text-xl md:text-2xl font-bold text-zinc-100 tracking-wider">00</span>
            <span class="text-[9px] text-zinc-500 font-medium mt-0.5">SEC</span>
          </div>
        `;
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      timerRef.current.innerHTML = `
        <div class="flex flex-col items-center">
          <span class="text-xl md:text-2xl font-bold text-zinc-100 tracking-wider">${String(hours).padStart(2, '0')}</span>
          <span class="text-[9px] text-zinc-500 font-medium mt-0.5">HR</span>
        </div>
        <span class="text-lg md:text-xl font-bold text-zinc-600 mt-[-15px] px-1">:</span>
        <div class="flex flex-col items-center">
          <span class="text-xl md:text-2xl font-bold text-zinc-100 tracking-wider">${String(mins).padStart(2, '0')}</span>
          <span class="text-[9px] text-zinc-500 font-medium mt-0.5">MIN</span>
        </div>
        <span class="text-lg md:text-xl font-bold text-zinc-600 mt-[-15px] px-1">:</span>
        <div class="flex flex-col items-center">
          <span class="text-xl md:text-2xl font-bold text-zinc-100 tracking-wider">${String(secs).padStart(2, '0')}</span>
          <span class="text-[9px] text-zinc-500 font-medium mt-0.5">SEC</span>
        </div>
      `;
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [contest.startDate, contest.duration]);

  const participantCount = (!contest.participants || contest.participants === '-') 
    ? getFakeParticipantCount(contest.id || contest.title) 
    : contest.participants;

  return (
    <div 
      className="rounded-xl border border-white/5 bg-[#0e0e11] relative overflow-hidden animate-in shrink-0 w-full sm:min-w-[480px] lg:min-w-[500px]"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5 pointer-events-none"></div>
      
      <div className="p-6 relative z-10">
        {/* Top Header Row */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#09090b] border border-white/5 flex items-center justify-center overflow-hidden p-2.5 shrink-0">
            <PlatformLogo url={contest.logo} platformName={formatPlatformName(contest.platform)} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-base md:text-lg font-bold text-zinc-100 truncate">{contest.title}</h3>
                <div className="flex items-center justify-center px-1.5 py-0.5 rounded-[4px] bg-red-600">
                  <span className="text-[10px] font-bold text-white leading-none">LIVE</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium shrink-0">
                <Users className="w-3.5 h-3.5" />
                {participantCount}
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              {/* Timer Block */}
              <div>
                <p className="text-xs text-zinc-500 mb-1">Ends in</p>
                <div 
                  ref={timerRef} 
                  className="flex items-center gap-3 font-mono text-zinc-200"
                >
                  {/* Timer innerHTML injected here */}
                  -- : -- : --
                </div>
              </div>

              {/* Action Button */}
              <a 
                href={contest.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-1.5 px-10 py-2 rounded-lg border border-red-500/30 bg-transparent hover:bg-red-500/10 transition-colors font-medium text-xs text-zinc-100 mt-auto sm:mt-0"
              >
                Participate
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-100 transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
