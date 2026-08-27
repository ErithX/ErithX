'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal } from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => 
    pathname === path 
      ? 'bg-white/[0.05] text-white font-medium' 
      : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]';

  return (
    <div className="min-h-screen flex flex-col bg-[#08080a] text-zinc-300 font-sans selection:bg-emerald-500/30 selection:text-white">
      <Navbar />

      <div className="flex-1 flex max-w-[1400px] w-full mx-auto">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-white/[0.05] hidden md:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-6 shrink-0">
          <nav className="space-y-8">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3 px-3">Getting Started</h4>
              <ul className="space-y-1">
                <li>
                  <Link href="/docs" className={`block px-3 py-1.5 rounded-md text-sm transition-all ${isActive('/docs')}`}>
                    Introduction
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3 px-3">Core Features</h4>
              <ul className="space-y-1">
                <li>
                  <Link href="/docs/performance-analysis" className={`block px-3 py-1.5 rounded-md text-sm transition-all ${isActive('/docs/performance-analysis')}`}>
                    Performance Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/docs/contest-tracker" className={`block px-3 py-1.5 rounded-md text-sm transition-all ${isActive('/docs/contest-tracker')}`}>
                    Contest Tracker
                  </Link>
                </li>
                <li>
                  <Link href="/docs/creator-studio" className={`block px-3 py-1.5 rounded-md text-sm transition-all ${isActive('/docs/creator-studio')}`}>
                    Creator Studio
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3 px-3">System</h4>
              <ul className="space-y-1">
                <li>
                  <Link href="/docs/notifications" className={`block px-3 py-1.5 rounded-md text-sm transition-all ${isActive('/docs/notifications')}`}>
                    Notifications
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-20">
            {children}
          </div>
          <div className="px-6 md:px-12 mt-12 pb-12 max-w-3xl mx-auto border-t border-white/5 pt-12">
         
          </div>
        </main>
      </div>
    </div>
  );
}
