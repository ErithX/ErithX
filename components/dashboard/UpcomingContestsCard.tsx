"use client";

import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { contestFetch } from '@/app/utils/contestFetch';
import { Contest } from '@/components/DsaContestCard';

export default function UpcomingContestsCard() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const mapped = await contestFetch();
        if (mapped) {
          const now = new Date();
          const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
          
          const upcoming = mapped
            .filter(c => {
              // Parse date and time to Date object
              // date is something like "Jun 24, 2026", time is "8:00 PM IST"
              // In Contest object, c.date and c.time are strings.
              // It's easier if we filter based on duration or just parse the date.
              // Actually contestFetch maps `c.date` and `c.time` from `sDate`.
              const contestDate = new Date(c.startDate);
              return contestDate > now && contestDate <= twoDaysFromNow;
            })
            .slice(0, 4); // Limit to top 4

          setContests(upcoming);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  return (
    <div className="glass rounded-2xl p-5">
      <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-4">
        <Calendar className="w-3.5 h-3.5" /> Upcoming (48h)
      </h2>
      <div className="space-y-2">
        {loading ? (
          <div className="text-xs text-zinc-500 italic">Loading contests...</div>
        ) : contests.length === 0 ? (
          <div className="text-xs text-zinc-500 italic">No contests in the next 48 hours.</div>
        ) : (
          contests.map((c, i) => {
            const formattedDate = new Date(c.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            return (
              <a 
                key={i} 
                href={c.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-3 rounded-xl border transition-colors hover:border-emerald-500/30 bg-white/5 border-white/10"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-zinc-200 truncate pr-2">{c.title}</span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded font-bold bg-white/10" style={{ color: c.platformColor }}>
                    {c.statusLabel}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 flex justify-between">
                  <span>{formattedDate} • {c.time}</span>
                  <span style={{ color: c.platformColor }}>{c.platform}</span>
                </div>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}
