"use client";

import React, { useState, useEffect } from 'react';
import { 
  Link as LinkIcon, Plus, ExternalLink, RefreshCw, 
  CheckCircle2, AlertCircle, ShieldAlert, Sparkles, Github
} from 'lucide-react';
import ProfileLinkModal from './ProfileLinkModal';

interface PlatformData {
  handle: string;
  url: string;
  verified: boolean;
  avatar?: string;
  displayName?: string;
  statsSummary?: Record<string, any>;
}

export default function ConnectedProfilesCard() {
  const [platforms, setPlatforms] = useState<{
    leetcode?: PlatformData | null;
    github?: PlatformData | null;
    codeforces?: PlatformData | null;
  }>({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/profiles');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.platforms) {
          setPlatforms(data.platforms);
        }
      }
    } catch (err) {
      console.error('Error fetching linked profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const totalConnected = Object.values(platforms).filter(p => p && p.handle).length;

  return (
    <>
      <div className="glass rounded-2xl p-6 border border-white/10 relative overflow-hidden">
        
        {/* Subtle ambient light */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <LinkIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-300 flex items-center gap-2">
                Connected Coding Profiles
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-white/5 border border-white/10 text-zinc-400 font-mono">
                  {totalConnected}/3 Linked
                </span>
              </h2>
              <p className="text-[11px] text-zinc-500">Live ingestion & progress delta monitoring for v3 Reviewer</p>
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-500/10"
          >
            <Plus className="w-3.5 h-3.5" />
            {totalConnected > 0 ? 'Manage' : 'Connect Profiles'}
          </button>
        </div>

        {/* Platform List */}
        <div className="space-y-2.5">
          
          {/* LEETCODE ITEM */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-base shrink-0">
                🟠
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white">LeetCode</span>
                  {platforms.leetcode?.handle ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      SYNCED
                    </span>
                  ) : (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700">
                      NOT CONNECTED
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {platforms.leetcode?.handle ? (
                    <span>
                      @{platforms.leetcode.handle} 
                      {platforms.leetcode.statsSummary?.totalSolved !== undefined && (
                        <span className="text-zinc-500"> • {platforms.leetcode.statsSummary.totalSolved} solved</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-zinc-600">Connect to track contest rating & solved problem density</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 ml-3">
              {platforms.leetcode?.handle ? (
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-orange-400">
                    {platforms.leetcode.statsSummary?.contestRating || 'Unrated'}
                  </div>
                  <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Contest Rating</div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs font-medium text-orange-400 hover:text-orange-300 px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition-colors"
                >
                  Connect
                </button>
              )}
            </div>
          </div>

          {/* GITHUB ITEM */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Github className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white">GitHub</span>
                  {platforms.github?.handle ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      SYNCED
                    </span>
                  ) : (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700">
                      NOT CONNECTED
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {platforms.github?.handle ? (
                    <span>
                      @{platforms.github.handle}
                      {platforms.github.statsSummary?.publicRepos !== undefined && (
                        <span className="text-zinc-500"> • {platforms.github.statsSummary.publicRepos} public repos</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-zinc-600">Connect to monitor commit velocity & project pull requests</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 ml-3">
              {platforms.github?.handle ? (
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-purple-400">
                    {platforms.github.statsSummary?.publicRepos || 0}
                  </div>
                  <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Public Repos</div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs font-medium text-purple-400 hover:text-purple-300 px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                >
                  Connect
                </button>
              )}
            </div>
          </div>

          {/* CODEFORCES ITEM */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-base shrink-0">
                🔴
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white">Codeforces</span>
                  {platforms.codeforces?.handle ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      SYNCED
                    </span>
                  ) : (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700">
                      NOT CONNECTED
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {platforms.codeforces?.handle ? (
                    <span>
                      @{platforms.codeforces.handle} 
                      {platforms.codeforces.statsSummary?.rank && (
                        <span className="text-zinc-500 capitalize"> • {platforms.codeforces.statsSummary.rank}</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-zinc-600">Connect to track algorithmic contest rating & division status</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 ml-3">
              {platforms.codeforces?.handle ? (
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-red-400">
                    {platforms.codeforces.statsSummary?.rating || 'Unrated'}
                  </div>
                  <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Contest Rating</div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs font-medium text-red-400 hover:text-red-300 px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                >
                  Connect
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Profile Linking Modal */}
      <ProfileLinkModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialPlatforms={platforms}
        onSaveSuccess={(updated) => setPlatforms(updated)}
      />
    </>
  );
}
