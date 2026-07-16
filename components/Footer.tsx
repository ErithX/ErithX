import React from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#09090b] border-t border-white/5 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-white">DSA Quest</span>
          </Link>
          <p className="text-sm text-zinc-400 max-w-xs">
            Track coding contests, practice DSA, and prepare for your dream FAANG interview.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-12">
          <div className="flex flex-col gap-3">
            <h3 className="font-medium text-white text-sm">Legal & Trust</h3>
            <Link href="/privacy" className="text-sm text-zinc-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-zinc-400 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/about" className="text-sm text-zinc-400 hover:text-white transition-colors">About Us & Team</Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} DSA Quest. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
