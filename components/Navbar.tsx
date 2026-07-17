"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Zap, LogOut, LogIn, Rocket, Menu, X } from 'lucide-react';
import { createClient } from '@/app/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useAuthStore } from '@/store/authStore';
import AuthModal from '@/components/AuthModal';

export default function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, loading } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#09090b]/90 backdrop-blur-[12px] text-white">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 text-white">
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
              <Link href="/contact" className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded">Contact Us</Link>
              <Link href="/faq" className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded">FAQ</Link>
            </div>
          </div>
          <div className="flex items-center gap-3 relative">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse"></div>
            ) : user ? (
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
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-zinc-300 text-xs font-medium hover:bg-white/5 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
                <button 
                  onClick={() => setIsAuthOpen(true)} 
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-zinc-900 text-xs font-medium hover:bg-zinc-200 transition-all"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  Start Free
                </button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-1.5 text-zinc-400 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-14 left-0 w-full bg-[#09090b]/95 border-b border-white/5 backdrop-blur-xl animate-in slide-in-from-top-2 shadow-2xl">
            <div className="flex flex-col p-4 gap-2">
              {user?.user_metadata?.role === 'professional' ? (
                <>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/dashboard/pro" className="p-3 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">Creator Dashboard</Link>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/resources" className="p-3 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">Resources</Link>
                </>
              ) : (
                <>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/contests" className="p-3 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">Contests</Link>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href={user ? "/dashboard" : "/"} className="p-3 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">Dashboard</Link>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/resources" className="p-3 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">Resources</Link>
                </>
              )}
              <div className="h-px w-full bg-white/10 my-2"></div>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/contact" className="p-3 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">Contact Us</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/faq" className="p-3 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">FAQ</Link>
              
              {!user && (
                <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-white/10">
                  <button 
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: { redirectTo: `${window.location.origin}/auth/callback?next=/` }
                      });
                    }} 
                    className="p-3 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors text-left flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); setIsAuthOpen(true); }} 
                    className="p-3 text-sm font-medium text-zinc-900 bg-white hover:bg-zinc-200 rounded-lg transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <Rocket className="w-4 h-4" />
                    Start Free
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
