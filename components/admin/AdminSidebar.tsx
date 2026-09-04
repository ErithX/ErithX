"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Users, 
  FileText, 
  BookOpen, 
  ArrowLeft, 
  Shield, 
  Activity,
  Zap
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab?: 'reviews' | 'users' | 'review' | 'resources';
}

export default function AdminSidebar({ activeTab }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      id: 'reviews',
      name: 'Review Studio',
      href: '/dashboard/admin/reviews',
      icon: Sparkles,
      badge: 'AI',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      id: 'resources',
      name: 'Users Directory',
      href: '/superadmin',
      icon: Users,
      badge: null,
      badgeColor: ''
    },
    {
      id: 'users',
      name: 'Live Telemetry',
      href: '/dashboard/admin/users',
      icon: Activity,
      badge: 'Live',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      id: 'review',
      name: 'Content Approvals',
      href: '/dashboard/admin/review',
      icon: FileText,
      badge: null,
      badgeColor: ''
    }
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-zinc-800/80 bg-[#09090b] min-h-[calc(100vh-65px)] flex flex-col justify-between p-4 sticky top-16 select-none">
      <div className="space-y-6">
        {/* Admin Suite Header */}
        <div className="px-3 pt-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">ErithX Admin Suite</span>
          </div>
          <p className="text-xs text-zinc-500">Zero-noise management hub</p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab ? activeTab === item.id : pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/[0.06] text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`} />
                  <span className="tracking-tight">{item.name}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Return Link */}
      <div className="pt-4 border-t border-zinc-800/80 space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.02] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-zinc-500" />
          <span>Return to Dashboard</span>
        </Link>
        <div className="px-3 text-[10px] text-zinc-600 font-mono">
          Production V3 • Build 2026.1
        </div>
      </div>
    </aside>
  );
}
