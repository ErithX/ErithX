"use client";

import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { createClient } from '@/app/lib/supabase/client';

export default function CreatorPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const checkPopup = async () => {
      // Don't show if they already saw it
      if (localStorage.getItem('creator_prompt_shown') === 'true') return;

      // Don't show if they are already a professional or already have a profile
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      
      if (data.user) {
        if (data.user.user_metadata?.role === 'professional') return;
      }

      // Check visit count
      let visits = parseInt(localStorage.getItem('resource_visits') || '0');
      visits += 1;
      localStorage.setItem('resource_visits', visits.toString());

      // Show on 2nd visit, after 10 seconds
      if (visits >= 2) {
        const timer = setTimeout(() => {
          setShow(true);
        }, 10000);
        return () => clearTimeout(timer);
      }
    };

    checkPopup();
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem('creator_prompt_shown', 'true');
  };

  const handleAction = () => {
    setShow(false);
    localStorage.setItem('creator_prompt_shown', 'true');
    window.location.href = '/dashboard?tab=profile';
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="relative overflow-hidden rounded-2xl bg-[#09090b]/90 backdrop-blur-xl border border-white/10 shadow-2xl p-6">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 blur-2xl rounded-full pointer-events-none"></div>
        
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">AI is rewriting the rules.</h3>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              In 2026, grinding LeetCode isn't enough. Stand out by building your public proof. Set up your Creator Profile to share your journey and get noticed by recruiters.
            </p>
            <div className="flex gap-2">
              <button 
                onClick={handleAction}
                className="flex-1 bg-white text-zinc-900 text-xs font-semibold py-2 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1.5"
              >
                Set up Profile <ArrowRight className="w-3 h-3" />
              </button>
              <button 
                onClick={handleClose}
                className="px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded-lg bg-white/5 hover:bg-white/10"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
