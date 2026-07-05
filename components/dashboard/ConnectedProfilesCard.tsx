import React from 'react';
import { Link as LinkIcon, Plus } from 'lucide-react';

export default function ConnectedProfilesCard() {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <LinkIcon className="w-3.5 h-3.5" /> Connected Profiles
        </h2>
        <button className="text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors font-medium flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-base">🟠</span>
            <div><div className="text-xs font-medium">LeetCode <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded font-bold ml-1">SYNCED</span></div><div className="text-[10px] text-zinc-500">arjun_mishra • 487 solved</div></div>
          </div>
          <div className="text-right"><div className="text-xs mono font-semibold text-orange-400">1,847</div><div className="text-[9px] text-zinc-500">Rating</div></div>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-base">🔴</span>
            <div><div className="text-xs font-medium">Codeforces <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded font-bold ml-1">SYNCED</span></div><div className="text-[10px] text-zinc-500">arjun_mishra • Specialist</div></div>
          </div>
          <div className="text-right"><div className="text-xs mono font-semibold text-red-400">1,560</div><div className="text-[9px] text-zinc-500">Rating</div></div>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-base">🟢</span>
            <div><div className="text-xs font-medium">CodeChef <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded font-bold ml-1">SYNCED</span></div><div className="text-[10px] text-zinc-500">arjun_mishra • 4★</div></div>
          </div>
          <div className="text-right"><div className="text-xs mono font-semibold text-green-400">1,823</div><div className="text-[9px] text-zinc-500">Rating</div></div>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-base">⚪</span>
            <div><div className="text-xs font-medium">GitHub <span className="text-[8px] bg-yellow-500/20 text-yellow-400 px-1 py-0.5 rounded font-bold ml-1">SYNCING</span></div><div className="text-[10px] text-zinc-500">arjunmishra • 142 contrib</div></div>
          </div>
          <div className="text-right"><div className="text-xs mono font-semibold text-zinc-300">142</div><div className="text-[9px] text-zinc-500">Contribs</div></div>
        </div>
      </div>
    </div>
  );
}
