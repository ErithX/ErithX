'use client';

import React from 'react';

export default function WeekStrip({ elapsed, isToday }: { elapsed: number; isToday: boolean }) {
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: 7 }).map((_, i) => {
        const isSunday = i === 6;
        let cls = 'bg-white/[0.05]';                                     // future days
        if (i < elapsed) cls = 'bg-white/[0.14]';                        // days passed
        if (i === elapsed && !isSunday) cls = 'bg-white/[0.30]';         // today, in progress
        if (isSunday)
          cls = isToday
            ? 'sr-pulse bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.7)]'
            : 'bg-rose-400/70 shadow-[0_0_8px_rgba(244,63,94,0.35)]';    // the target
        return <span key={i} className={`h-[3px] flex-1 rounded-full ${cls}`} />;
      })}
      <span className="ml-2 shrink-0 font-mono text-[9px] uppercase tracking-[0.18em] text-rose-300/80">
        {isToday ? 'Tonight' : 'Sun'}
      </span>
    </div>
  );
}
