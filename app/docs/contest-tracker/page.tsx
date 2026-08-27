import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contest Tracker | ErithX Docs',
  description: 'Learn how to use the ErithX Contest Tracker and 1-Click Calendar Sync.',
};

export default function ContestTrackerPage() {
  return (
    <section id="contest-tracker">
      <div className="mb-8 text-sm text-zinc-500 flex items-center gap-2">
        <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/docs" className="hover:text-zinc-300 transition-colors">Docs</Link>
        <span>/</span>
        <span className="text-zinc-300">Contest Tracker</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-4">Contest Tracker & Synchronization</h1>
      <p className="text-[15px] leading-relaxed text-zinc-400 mb-6">
        The Contest Tracker is designed to surface high-quality competitive programming matches that actually matter for your growth. We do not list 100+ random contests; we curate matches from 10+ major platforms (LeetCode, Codeforces, CodeChef, AtCoder, etc.) to ensure you never miss a meaningful opportunity.
      </p>

      <h2 className="text-2xl font-semibold text-white mt-10 mb-4 pb-2 border-b border-white/[0.05]">1-Click Calendar Sync</h2>
      <p className="text-[15px] leading-relaxed text-zinc-400 mb-4">
        You can add contests directly to your personal Google Calendar or Apple iCal with a single click. This bypasses the need for brittle browser extensions or manual entry.
      </p>
      <ul className="list-disc pl-6 space-y-2 text-[15px] text-zinc-400 mb-6">
        <li><strong className="text-white font-medium">Timezone Auto-Conversion:</strong> Contest start times are strictly encoded in UTC and automatically translated to your exact local timezone.</li>
        <li><strong className="text-white font-medium">Event Metadata:</strong> Calendar events are injected with rich metadata, including official titles, platform origin tags, and direct participation URLs.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-white mt-10 mb-4 pb-2 border-b border-white/[0.05]">Email Alerts</h2>
      <p className="text-[15px] leading-relaxed text-zinc-400 mb-6">
        You can sign up for one-click email alerts to receive reminders before your favorite contests begin. We do not spam. Notifications are strictly reserved for actionable items that contribute to your preparation.
      </p>

      <div className="mt-16 pt-8 border-t border-white/[0.05] flex justify-between items-center">
        <Link href="/docs/performance-analysis" className="text-sm text-white hover:text-emerald-400 flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Performance Analysis
        </Link>
        <Link href="/docs/creator-studio" className="text-sm text-white hover:text-emerald-400 flex items-center gap-2 transition-colors">
          Creator Studio
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
