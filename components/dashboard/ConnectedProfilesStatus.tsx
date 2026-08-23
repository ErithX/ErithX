import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Settings2, PlusCircle } from 'lucide-react';
import { createClient } from '@/app/lib/supabase/client';

export default function ConnectedProfilesStatus() {
  const [platforms, setPlatforms] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/user/profiles');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.platforms) {
            setPlatforms(json.platforms);
          }
        }
      } catch (err) {
        console.error("Failed to load platforms", err);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return null;

  const connectedList = [
    platforms?.leetcode?.handle ? { key: 'leetcode', name: 'LeetCode', handle: platforms.leetcode.handle, stats: 'Solved', val: '312' } : null,
    platforms?.codeforces?.handle ? { key: 'codeforces', name: 'Codeforces', handle: platforms.codeforces.handle, stats: 'Rating', val: '1542' } : null,
    platforms?.github?.handle ? { key: 'github', name: 'GitHub', handle: platforms.github.handle, stats: 'Repos', val: '14' } : null
  ].filter(Boolean) as any[];

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-light text-lg tracking-wide text-zinc-100">Connected Profiles</h3>
        <Link href="/dashboard/settings#connections" className="text-zinc-500 hover:text-white transition-colors">
          <Settings2 className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {connectedList.length === 0 ? (
          <div className="text-sm text-zinc-400 py-4 text-center">No platforms connected yet.</div>
        ) : (
          connectedList.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3">
                <div className={`relative w-8 h-8 rounded-md flex items-center justify-center border ${p.key === 'leetcode' ? 'bg-orange-500/10 border-orange-500/20' : p.key === 'codeforces' ? 'bg-red-500/10 border-red-500/20' : 'bg-zinc-500/10 border-zinc-500/20'}`}>
                  {p.key === 'leetcode' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFA116">
                      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125 2.513 5.277 5.277 0 0 0 .867 2.362 5.344 5.344 0 0 0 2.083 1.727 5.286 5.286 0 0 0 2.636.381 5.338 5.338 0 0 0 2.365-.846l1.242-.916h.01l1.523-1.125a.936.936 0 0 0 .339-.462.936.936 0 0 0 .016-.57.943.943 0 0 0-.256-.479.932.932 0 0 0-.495-.27.935.935 0 0 0-.573.013.93.93 0 0 0-.466.347l-1.531 1.131-1.235.91a3.481 3.481 0 0 1-1.542.551 3.447 3.447 0 0 1-1.72-.25 3.47 3.47 0 0 1-1.359-1.127 3.504 3.504 0 0 1-.567-1.543 3.493 3.493 0 0 1 .082-1.642 3.446 3.446 0 0 1 .79-1.375l3.858-4.128 5.405-5.787a.895.895 0 0 1 .632-.284.904.904 0 0 1 .635.286.9.9 0 0 1 .28.636.9.9 0 0 1-.285.632l-2.079 2.227 1.48 1.483 3.69-3.953a.908.908 0 0 0-.244-1.38c-.378-.216-.838-.178-1.18.098l-2.039 2.186 1.48 1.483 3.69-3.953c.184-.199.273-.464.249-.733a1.365 1.365 0 0 0-.441-.884l-.04-.04a1.35 1.35 0 0 0-.898-.445z"/>
                    </svg>
                  ) : p.key === 'codeforces' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF3B3B">
                      <path d="M4.5 7.5A1.5 1.5 0 0 1 6 9v10.5a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 0 19.5V9a1.5 1.5 0 0 1 1.5-1.5h3zm9-4.5A1.5 1.5 0 0 1 15 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-15a1.5 1.5 0 0 1 1.5-1.5h3zm9 7.5A1.5 1.5 0 0 1 24 12v7.5a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5V12a1.5 1.5 0 0 1 1.5-1.5h3z"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  )}
                </div>
                <div>
                  <div className="text-sm text-zinc-200 font-light tracking-wide">{p.name}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{p.handle}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm text-white">{p.val}</div>
                <div className="text-[9px] uppercase tracking-wider text-zinc-600">{p.stats}</div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <Link href="/dashboard/settings#connections" className="w-full mt-3 py-2 rounded-lg border border-dashed border-white/10 text-zinc-400 font-light tracking-wide text-xs hover:bg-white/[0.03] hover:text-white transition-all flex items-center justify-center gap-2">
        <PlusCircle className="w-3.5 h-3.5" />
        Connect Another Platform
      </Link>
    </div>
  );
}
