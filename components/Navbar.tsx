"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Zap, LogOut, LogIn, Rocket } from 'lucide-react';
import { createClient } from '@/app/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useAuthStore } from '@/store/authStore';
import AuthModal from '@/components/AuthModal';

export default function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, loading } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#09090b]/85 backdrop-blur-[12px]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-semibold text-sm tracking-tight">DSA Quest</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {user?.user_metadata?.role === 'professional' ? (
                <>
                  <Link href="/dashboard/pro" className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded">Creator Dashboard</Link>
                  <Link href="/resources" className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded">Resources</Link>
                </>
              ) : (
                <>
                  <Link href="/contests" className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded">Contests</Link>
                  <Link href={user ? "/dashboard" : "/"} className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded">Dashboard</Link>
                  <Link href="/resources" className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded">Resources</Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 relative">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-white/5 transition-all focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 overflow-hidden shrink-0">
                    {user.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover" 
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback" }}
                      />
                    ) : (
                      <span className="text-xs font-bold">{user.email?.charAt(0).toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-zinc-300">
                    Hi, {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
                  </span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#09090b] border border-white/10 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-xs text-white font-medium truncate mb-0.5">{user.user_metadata?.full_name || 'User'}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
                    </div>
                    <div className="p-1">
                      <button 
                        onClick={async () => {
                          await supabase.auth.signOut();
                          setIsDropdownOpen(false);
                          window.location.reload();
                        }} 
                        className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button 
                  onClick={async () => {
                    await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: { redirectTo: `${window.location.origin}/auth/callback?next=/` }
                    });
                  }} 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-zinc-300 text-xs font-medium hover:bg-white/5 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
                <button 
                  onClick={() => setIsAuthOpen(true)} 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-zinc-900 text-xs font-medium hover:bg-zinc-200 transition-all"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  Start Free
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
