import React from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#09090b] border-t border-white/5 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex flex-col gap-4 max-w-sm">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-white">DSA Quest</span>
          </Link>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The complete software engineering preparation platform. Track upcoming coding contests, practice Data Structures & Algorithms, and find verified CS study materials.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Contests Navigation */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider text-emerald-400">Contests Hub</h3>
            <Link href="/contests" className="text-sm text-zinc-400 hover:text-white transition-colors">Coding Contests Tracker</Link>
            <Link href="/features" className="text-sm text-zinc-400 hover:text-white transition-colors">Features & 1-Click Calendar Sync</Link>
            <Link href="/docs" className="text-sm text-zinc-400 hover:text-white transition-colors">Platform Docs & Guides</Link>
            <Link href="/faq" className="text-sm text-zinc-400 hover:text-white transition-colors">Platform & Contest FAQ</Link>
          </div>

          {/* Resources Navigation */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider text-emerald-400">Study Resources</h3>
            <Link href="/resources" className="text-sm text-zinc-400 hover:text-white transition-colors">DSA Notes & Interview Guides</Link>
            <Link href="/dashboard/write" className="text-sm text-zinc-400 hover:text-white transition-colors">Publish Study Notes</Link>
          </div>

          {/* Top Reads (SEO Pillar Content) */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider text-emerald-400">Top Reads</h3>
            <Link href="/resources/system-design-rag-era-vector-dbs-embeddings-new-round" className="text-sm text-zinc-400 hover:text-white transition-colors leading-snug">System Design for RAG & Vector DBs</Link>
            <Link href="/resources/the-real-tier-3-hiring-playbook-for-2026-2842" className="text-sm text-zinc-400 hover:text-white transition-colors leading-snug">Tier 3 Software Engineering Hiring Playbook</Link>
            <Link href="/resources/dsa-in-the-age-of-copilot-why-algorithmic-thinking-still-wins-in-2026-594" className="text-sm text-zinc-400 hover:text-white transition-colors leading-snug">DSA & Algorithmic Thinking vs AI Copilot</Link>
          </div>

          {/* Legal & Trust */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider text-emerald-400">Company & Legal</h3>
            <Link href="/about" className="text-sm text-zinc-400 hover:text-white transition-colors">About Us & Team</Link>
            <Link href="/contact" className="text-sm text-zinc-400 hover:text-white transition-colors">Contact Support</Link>
            <Link href="/privacy" className="text-sm text-zinc-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-zinc-400 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} DSA Quest. All rights reserved. Built for competitive programmers & CS students.
        </p>
      </div>
    </footer>
  );
}
