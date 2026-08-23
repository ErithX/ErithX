import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, FileText, PenTool, Users, ArrowRight, AlertCircle } from 'lucide-react';

export default function GiveBackCard() {
  const [showToast, setShowToast] = useState(false);

  const handleCompeteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  return (
    <div className="glass rounded-2xl p-6 md:p-8 relative">
      {/* Toast Notification */}
      <div className={`absolute -top-12 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
        <div className="glass px-4 py-2.5 rounded-lg border border-purple-500/20 shadow-2xl flex items-center gap-3 whitespace-nowrap">
          <AlertCircle className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-zinc-200">Global Leaderboards will be arriving in the next major update.</span>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-2">
        <Heart className="w-5 h-5 text-red-400" />
        <h2 className="font-medium text-lg text-white">Give Back to the Community</h2>
      </div>
      <p className="text-sm text-zinc-500 mb-6 max-w-lg">
        Your knowledge could be the exact thing someone else needs today. Contribute anonymously or build your reputation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Option 1 */}
        <Link 
          href="/dashboard/write" 
          className="give-back-card group block p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-red-500/20 hover:bg-red-500/[0.02] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <FileText className="w-5 h-5 text-red-400" />
          </div>
          <h4 className="font-medium text-sm text-white mb-1.5">Share Your Notes</h4>
          <p className="text-xs text-zinc-500 leading-relaxed mb-4">Got a killer cheat sheet? Upload it to help peers.</p>
          <div className="flex items-center gap-2 text-red-400">
            <span className="text-xs font-medium hover-underline">Upload now</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        {/* Option 2 */}
        <Link 
          href="/dashboard/write" 
          className="give-back-card group block p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
            <PenTool className="w-5 h-5 text-emerald-400" />
          </div>
          <h4 className="font-medium text-sm text-white mb-1.5">Write a Blog</h4>
          <p className="text-xs text-zinc-500 leading-relaxed mb-4">Broke down a hard problem? Share your journey.</p>
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="text-xs font-medium hover-underline">Start writing</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        {/* Option 3 */}
        <button 
          onClick={handleCompeteClick}
          className="give-back-card group block w-full text-left p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/20 hover:bg-purple-500/[0.02] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <h4 className="font-medium text-sm text-white mb-1.5">Compete Globally</h4>
          <p className="text-xs text-zinc-500 leading-relaxed mb-4">Check where you stand against the world.</p>
          <div className="flex items-center gap-2 text-purple-400">
            <span className="text-xs font-medium hover-underline">View Rank</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>
      </div>
    </div>
  );
}
