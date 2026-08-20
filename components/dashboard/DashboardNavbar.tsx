"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, LogOut, Settings } from 'lucide-react';

export default function DashboardNavbar({ 
  user, 
  loading, 
  isDropdownOpen, 
  setIsDropdownOpen, 
  dropdownRef, 
  handleLogout 
}: any) {
  const pathname = usePathname();
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#09090b]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-white">ErithX</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {user?.user_metadata?.role === 'professional' ? (
              <>
                <Link href="/dashboard/pro" className={`px-3 py-1.5 text-xs font-medium rounded ${pathname === '/dashboard/pro' ? 'text-white bg-white/5' : 'text-zinc-400 hover:text-white'}`}>Creator Studio</Link>
                <Link href="/resources" className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded">Resources</Link>
              </>
            ) : (
              <>
                <Link href="/contests" className="px-3 py-1.5 text-xs font-medium text-white bg-white/5 rounded">Contests</Link>
                <Link href="/resources" className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded">Resources</Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse"></div>
          ) : user && (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
              >
                <img 
                  src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#18181b] border border-white/10 shadow-2xl py-1 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                    <p className="text-sm font-medium text-white truncate">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>
                  <div className="p-1 space-y-0.5 border-b border-white/5 pb-1 mb-1">
                    <Link href="/dashboard/settings" className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </div>
                  <div className="p-1">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
