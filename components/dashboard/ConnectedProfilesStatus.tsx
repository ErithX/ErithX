"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface PlatformData {
  handle: string;
  url: string;
  verified: boolean;
  avatar?: string;
  displayName?: string;
  statsSummary?: Record<string, any>;
}

export default function ConnectedProfilesStatus() {
  const [platforms, setPlatforms] = useState<{
    leetcode?: PlatformData | null;
    github?: PlatformData | null;
    codeforces?: PlatformData | null;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const res = await fetch('/api/user/profiles');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.platforms) {
            setPlatforms(data.platforms);
          }
        }
      } catch (err) {
        console.error('Error loading profile status:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfiles();
  }, []);

  if (loading) return null;

  const connectedList = [
    platforms.leetcode?.handle ? { key: 'leetcode', name: 'LeetCode', handle: platforms.leetcode.handle } : null,
    platforms.github?.handle ? { key: 'github', name: 'GitHub', handle: platforms.github.handle } : null,
    platforms.codeforces?.handle ? { key: 'codeforces', name: 'Codeforces', handle: platforms.codeforces.handle } : null
  ].filter(Boolean) as any[];

  // If no profiles linked yet
  if (connectedList.length === 0) {
    return (
      <div className="border border-zinc-800 bg-black rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <h3 className="text-sm font-medium text-white">
            Connect Coding Profiles
          </h3>
          <p className="text-sm text-zinc-400 mt-1">
            Attach your handles in Settings to unlock automatic progress reviews.
          </p>
        </div>

        <Link
          href="/dashboard/settings#connections"
          className="self-start sm:self-auto px-4 py-2 rounded-md bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors shrink-0"
        >
          Connect in Settings
        </Link>
      </div>
    );
  }

  // If profiles are linked
  return (
    <div className="border border-zinc-800 bg-black rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans">
      <div>
        <div className="text-sm font-medium text-white">
          Coding Profiles
        </div>
        <div className="flex items-center gap-3 flex-wrap mt-2">
          {connectedList.map(item => (
            <span 
              key={item.key}
              className="text-sm text-zinc-400"
            >
              {item.name}: <span className="text-zinc-200">{item.handle}</span>
            </span>
          ))}
        </div>
      </div>

      <Link
        href="/dashboard/settings#connections"
        className="self-start md:self-auto px-4 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-white text-sm font-medium hover:bg-zinc-800 transition-colors shrink-0"
      >
        Manage Profiles
      </Link>
    </div>
  );
}
