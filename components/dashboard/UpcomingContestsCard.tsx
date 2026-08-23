"use client";

import React, { useEffect, useState } from 'react';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { contestFetch } from '@/app/utils/contestFetch';
import { Contest } from '@/components/DsaContestCard';

export default function UpcomingContestsCard() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContests() {
      try {
        const mapped = await contestFetch();
        if (mapped && mapped.length > 0) {
          setContests([mapped[0]]); // Just show the top contest
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadContests();
  }, []);

  if (loading) {
    return (
      <div className="glass rounded-2xl p-5 animate-pulse">
        <div className="h-4 bg-white/5 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-white/5 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-white/5 rounded w-full mb-6"></div>
        <div className="h-10 bg-white/5 rounded w-full"></div>
      </div>
    );
  }

  const contest = contests[0];
  if (!contest) return null;

  const formattedDate = new Date(contest.startDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">UPCOMING</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest" style={{ color: contest.platformColor }}>{contest.platform}</span>
      </div>
      
      <h3 className="font-light text-lg tracking-wide text-zinc-100 mb-2">{contest.title}</h3>
      <p className="text-sm font-light text-zinc-400 leading-relaxed mb-4">Test your skills against 20k+ developers globally.</p>
      
      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 mb-4">
        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}, {contest.time}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
          <Users className="w-3.5 h-3.5" />
          <span>23.1K</span>
        </div>
      </div>

      <a 
        href={contest.url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 text-sm font-light tracking-wide hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2 backdrop-blur-md"
      >
        View Contest Details
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}
