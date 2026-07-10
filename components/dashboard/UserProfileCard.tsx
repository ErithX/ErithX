import React from 'react';
import Link from 'next/link';
import { PenLine, FileText, Share2, Image as ImageIcon, Plus, Sparkles } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface UserProfileCardProps {
  user: User | null;
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-start gap-4 mb-6">
        <img 
          src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} 
          className="w-14 h-14 rounded-2xl object-cover border border-white/10" 
          alt="Profile" 
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback" }}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Coder'}
            </span>
            <span className="text-[8px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded font-bold">🥇 GOLD</span>
          </div>
          <div className="text-xs text-zinc-500 mt-0.5">III Year, NIT Trichy • CSE</div>
          <div className="text-[10px] text-zinc-600 mono mt-1">dsaquest.io/v/arjun-m</div>
        </div>
      </div>

      {/* Incomplete Profile Nudge */}
      <div className="mb-5 p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/[0.04] transition-colors">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8 transform -rotate-90">
              <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
              <circle cx="16" cy="16" r="14" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="88" strokeDashoffset="52.8" className="transition-all duration-1000" />
            </svg>
            <span className="absolute text-[8px] font-bold text-white">40%</span>
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">Profile Incomplete</div>
            <div className="text-[9px] text-zinc-500">Stand out. Add your socials & bio.</div>
          </div>
        </div>
        <Link href="/dashboard?tab=profile" className="text-[10px] font-medium text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Complete →
        </Link>
      </div>

      {/* Contribution Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/5">
          <div className="text-2xl font-bold mono text-zinc-600">0</div>
          <div className="text-[9px] uppercase tracking-widest text-zinc-600 mt-1">Blogs Written</div>
        </div>
        <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/5">
          <div className="text-2xl font-bold mono text-zinc-600">0</div>
          <div className="text-[9px] uppercase tracking-widest text-zinc-600 mt-1">Resources Shared</div>
        </div>
        <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/5">
          <div className="text-2xl font-bold mono text-zinc-600">0</div>
          <div className="text-[9px] uppercase tracking-widest text-zinc-600 mt-1">Diagrams Created</div>
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-2">
        <Link href="/dashboard/write" className="contribute-btn w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/10 text-left group hover:bg-white/5 transition-all">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            <PenLine className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">Share your project story</div>
            <div className="text-[10px] text-zinc-600">How you built it, what you learned, what went wrong — your struggle helps others.</div>
          </div>
          <Plus className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
        </Link>
        <Link href="/dashboard/write" className="contribute-btn w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/10 text-left group hover:bg-white/5 transition-all">
          <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-orange-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">Upload your study notes</div>
            <div className="text-[10px] text-zinc-600">That cheat sheet you made before exams? Someone else needs it right now.</div>
          </div>
          <Plus className="w-4 h-4 text-zinc-600 group-hover:text-orange-400 transition-colors flex-shrink-0" />
        </Link>
        <Link href="/dashboard/write" className="contribute-btn w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/10 text-left group hover:bg-white/5 transition-all">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
            <Share2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">Share a useful link</div>
            <div className="text-[10px] text-zinc-600">Found a great visualization tool or article? Share it with the community.</div>
          </div>
          <Plus className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 transition-colors flex-shrink-0" />
        </Link>
        <button className="contribute-btn w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/10 text-left group hover:bg-white/5 transition-all">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
            <ImageIcon className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">Draw a diagram or flowchart</div>
            <div className="text-[10px] text-zinc-600">Your rough BST traversal sketch? It's clearer than any textbook paragraph.</div>
          </div>
          <Plus className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
        </button>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span className="text-[10px] text-emerald-400">Share 3 resources to unlock the <strong>Contributor</strong> badge on your card</span>
      </div>
    </div>
  );
}
