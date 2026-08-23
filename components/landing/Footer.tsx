import React from 'react';
import { Zap, Twitter, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/newLogo.png" alt="ErithX Logo" width={120} height={32} className="h-8 w-auto object-contain" />
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">The student-first platform for CS engineering. Built with intent, not burnout.</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Platform</h4>
            <div className="space-y-2">
              <Link href="#ecosystem" className="block text-xs text-zinc-400 hover:text-white transition-colors">Ecosystem</Link>
              <Link href="#journey" className="block text-xs text-zinc-400 hover:text-white transition-colors">Student Journey</Link>
              <Link href="#community" className="block text-xs text-zinc-400 hover:text-white transition-colors">Community</Link>
              <Link href="#" className="block text-xs text-zinc-400 hover:text-white transition-colors">Milestone Cards</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Resources</h4>
            <div className="space-y-2">
              <Link href="/contests" className="block text-xs text-zinc-400 hover:text-white transition-colors">Contest Board</Link>
              <Link href="#" className="block text-xs text-zinc-400 hover:text-white transition-colors">Modern Roadmaps</Link>
              <Link href="/resources" className="block text-xs text-zinc-400 hover:text-white transition-colors">Engineering Blueprints</Link>
              <Link href="#" className="block text-xs text-zinc-400 hover:text-white transition-colors">Project Monitor</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Top Reads</h4>
            <div className="space-y-2">
              <Link href="/resources/system-design-rag-era-vector-dbs-embeddings-new-round" className="block text-xs text-zinc-400 hover:text-white transition-colors leading-relaxed">System Design for RAG & Vector DBs</Link>
              <Link href="/resources/the-real-tier-3-hiring-playbook-for-2026-2842" className="block text-xs text-zinc-400 hover:text-white transition-colors leading-relaxed">Tier 3 Software Engineering Hiring Playbook</Link>
              <Link href="/resources/dsa-in-the-age-of-copilot-why-algorithmic-thinking-still-wins-in-2026-594" className="block text-xs text-zinc-400 hover:text-white transition-colors leading-relaxed">DSA & Algorithmic Thinking vs AI Copilot</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Connect</h4>
            <div className="flex items-center gap-3 mb-4">
              <Link href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                <Github className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                <Linkedin className="w-4 h-4" />
              </Link>
            </div>
            <Link href="#" className="text-xs text-zinc-400 hover:text-white transition-colors">hello@dsaquest.com</Link>
          </div>
        </div>
        <div className="pt-6 border-t border-white/5 flex items-center justify-between flex-wrap gap-4">
          <div className="text-[10px] text-zinc-600">© 2026 ErithX. Built for students, backed by pros.</div>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors">Privacy</Link>
            <Link href="#" className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
