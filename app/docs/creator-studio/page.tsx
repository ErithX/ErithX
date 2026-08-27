import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, XCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Creator Studio | ErithX Docs',
  description: 'Guidelines for verified contributors publishing articles and career insights on ErithX.',
};

export default function CreatorStudioPage() {
  return (
    <section id="creator-studio">
      <div className="mb-8 text-sm text-zinc-500 flex items-center gap-2">
        <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/docs" className="hover:text-zinc-300 transition-colors">Docs</Link>
        <span>/</span>
        <span className="text-zinc-300">Creator Studio</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-4">Creator Studio & Guidelines</h1>
      <p className="text-[15px] leading-relaxed text-zinc-400 mb-6">
        The Creator Studio allows verified contributors to publish valuable articles, career insights, and deep dives directly to the ErithX community. Our core theme focus is the upcoming high-competitive environment; we aim to make students aware, give smart solutions, and provide useful notes.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-10 mb-4 pb-2 border-b border-white/[0.05]">Using the Editor</h2>
      <p className="text-[15px] leading-relaxed text-zinc-400 mb-4">
        Our rich text editor provides a smooth typing experience, supporting everything you need for technical writing:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-[15px] text-zinc-400 mb-6">
        <li>Attach images, code blocks, and tables.</li>
        <li>Markdown support and native syntax highlighting.</li>
        <li>Automatic draft saving mechanics.</li>
        <li>Optional cover image and hashtags upon submission.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-white mt-10 mb-4 pb-2 border-b border-white/[0.05]">Submission & Approval</h2>
      <p className="text-[15px] leading-relaxed text-zinc-400 mb-6">
        Once finished, your article goes into a pending state. Our team reviews all submissions to ensure they meet quality standards before going live. This ensures a high-signal, high-trust environment.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-10 mb-4 pb-2 border-b border-white/[0.05]">Strict Limitations</h2>
      <p className="text-[15px] leading-relaxed text-zinc-400 mb-6">
        To maintain quality, the following content will be rejected during review:
      </p>
      
      <div className="space-y-3 my-6">
        <div className="p-4 rounded-lg bg-red-500/[0.03] border border-red-500/10 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-300 m-0 mb-1">No AI-Generated Content</h3>
            <p className="text-sm text-zinc-400 m-0">We check for this. If it reads like generic AI output, it’s rejected. Write with a human, authentic voice.</p>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-red-500/[0.03] border border-red-500/10 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-300 m-0 mb-1">No Plagiarism or Copyright Violations</h3>
            <p className="text-sm text-zinc-400 m-0">Do not copy-paste others' work. Original insights only.</p>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-red-500/[0.03] border border-red-500/10 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-300 m-0 mb-1">No Low-Value Fluff</h3>
            <p className="text-sm text-zinc-400 m-0">Write in a tone that is scannable (short paragraphs, visuals). No walls of text.</p>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-red-500/[0.03] border border-red-500/10 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-300 m-0 mb-1">No Self-Promotion</h3>
            <p className="text-sm text-zinc-400 m-0">Focus purely on helping students. No disguised promotional links.</p>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-white/[0.05] flex justify-between items-center">
        <Link href="/docs/contest-tracker" className="text-sm text-white hover:text-emerald-400 flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Contest Tracker
        </Link>
        <Link href="/docs/notifications" className="text-sm text-white hover:text-emerald-400 flex items-center gap-2 transition-colors">
          Notifications
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
