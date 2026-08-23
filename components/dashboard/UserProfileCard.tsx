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
            {/* Removed dummy badge for now */}
          </div>
          
          {user?.user_metadata?.college && (
            <div className="text-xs text-zinc-500 mt-0.5">{user.user_metadata.college}</div>
          )}
          
          {/* URL is removed if not present */}
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-2">
        <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-3 px-1">Publish</div>
        
        <Link href="/dashboard/write" className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-dashed border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/20 transition-all text-left group">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:border-emerald-500/30 transition-colors">
            <PenLine className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">System Architecture</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Document infrastructure and design decisions.</div>
          </div>
          <Plus className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
        </Link>
        <Link href="/dashboard/write" className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-dashed border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/5 hover:border-cyan-500/20 transition-all text-left group">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:border-cyan-500/30 transition-colors">
            <FileText className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">Engineering Blueprint</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Share algorithms, patterns, or project blueprints.</div>
          </div>
          <Plus className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
        </Link>
        <Link href="/dashboard/write" className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-dashed border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/5 hover:border-purple-500/20 transition-all text-left group">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:border-purple-500/30 transition-colors">
            <Share2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">Developer Resource</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Curate high-signal tools and frameworks.</div>
          </div>
          <Plus className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
        </Link>
      </div>

      {/* <div className="mt-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span className="text-[10px] text-emerald-400">Share 3 resources to unlock the <strong>Contributor</strong> badge on your card</span>
      </div> */}
    </div>
  );
}
