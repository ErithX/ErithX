"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Zap, LogOut, LogIn, Rocket, Menu, X 
} from 'lucide-react';
import { createClient } from '@/app/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import AuthModal from '@/components/AuthModal';
import PlatformDropdown from '@/components/PlatformDropdown';

interface NavbarProps {
  darkMode?: boolean;
  setDarkMode?: (value: boolean) => void;
}

export default function Navbar({ darkMode, setDarkMode }: NavbarProps = {}) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, loading } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (platformRef.current && !platformRef.current.contains(event.target as Node)) {
        setIsPlatformOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isPlatformOpen 
          ? 'border-b border-white/10 bg-[#09090b]/95 backdrop-blur-2xl shadow-2xl' 
          : 'border-b border-transparent bg-transparent'
      } text-white`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Main Nav Links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 text-white group">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:border-emerald-500/40 transition-colors">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-semibold text-sm tracking-tight text-white group-hover:text-emerald-400 transition-colors">ErithX</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link 
                href="/contests" 
                className="px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                Contests
              </Link>

              <Link 
                href="/resources" 
                className="px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                Resources
              </Link>

              {/* Isolated Platform Dropdown Component */}
              <PlatformDropdown 
                isOpen={isPlatformOpen}
                onOpen={() => setIsPlatformOpen(true)}
                onClose={() => setIsPlatformOpen(false)}
                onToggle={() => setIsPlatformOpen(!isPlatformOpen)}
                dropdownRef={platformRef}
              />

              {/* Dashboard Link (If User Logged In) */}
              {user && (
                <Link 
                  href={user?.user_metadata?.role === 'professional' ? '/dashboard/pro' : '/dashboard'} 
                  className="px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* User Auth & Actions Right Side */}
          <div className="flex items-center gap-3 relative">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse"></div>
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-white/5 transition-all focus:outline-none border border-white/10"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 overflow-hidden shrink-0">
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
                  <span className="text-xs font-medium text-zinc-300">
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
                      {user?.email === process.env.NEXT_PUBLIC_SUPERADMIN_EMAILS && (
                        <Link 
                          href="/dashboard/admin/review" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full text-left px-3 py-2 text-xs text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors flex items-center gap-2 mb-1 font-medium"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                          Admin Review
                        </Link>
                      )}
                      <Link 
                        href={user?.user_metadata?.role === 'professional' ? '/dashboard/pro' : '/dashboard'}
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 mb-1"
                      >
                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                        Creator Studio
                      </Link>
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
                  className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/10 text-zinc-300 text-xs font-medium hover:bg-white/5 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
                <button 
                  onClick={() => setIsAuthOpen(true)} 
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-zinc-900 text-xs font-semibold hover:bg-zinc-200 transition-all shadow-lg shadow-white/5"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  Start Free
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-[#09090b]/95 border-b border-white/10 backdrop-blur-2xl animate-in slide-in-from-top-2 shadow-2xl p-4 space-y-3">
            <div className="flex flex-col gap-1">
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/contests" className="p-2.5 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">Contests</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/resources" className="p-2.5 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">Resources</Link>
              {user && (
                <Link onClick={() => setIsMobileMenuOpen(false)} href={user?.user_metadata?.role === 'professional' ? '/dashboard/pro' : '/dashboard'} className="p-2.5 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">Dashboard</Link>
              )}
            </div>

            <div className="h-px w-full bg-white/10"></div>

            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-2 pt-1">Platform Vault</div>
            <div className="flex flex-col gap-1">
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/features" className="p-2.5 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">Platform Features</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/docs" className="p-2.5 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">Documentation</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/about" className="p-2.5 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">About Us</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/contact" className="p-2.5 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">Contact Us</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/faq" className="p-2.5 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">FAQ</Link>
            </div>

            {!user && (
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                <button 
                  onClick={async () => {
                    setIsMobileMenuOpen(false);
                    await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: { redirectTo: `${window.location.origin}/auth/callback?next=/` }
                    });
                  }} 
                  className="p-2.5 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors text-left flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setIsAuthOpen(true); }} 
                  className="p-2.5 text-xs font-semibold text-zinc-900 bg-white hover:bg-zinc-200 rounded-lg transition-colors text-center flex items-center justify-center gap-2"
                >
                  <Rocket className="w-4 h-4" />
                  Start Free
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
