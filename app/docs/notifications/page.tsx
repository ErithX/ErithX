import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Notifications & Alerts | ErithX Docs',
  description: 'Manage your email alerts and notifications preferences on ErithX.',
};

export default function NotificationsPage() {
  return (
    <section id="notifications">
      <div className="mb-8 text-sm text-zinc-500 flex items-center gap-2">
        <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/docs" className="hover:text-zinc-300 transition-colors">Docs</Link>
        <span>/</span>
        <span className="text-zinc-300">Notifications</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-4">Notifications & Alerts</h1>
      <p className="text-[15px] leading-relaxed text-zinc-400 mb-4">
        You have full control over your notification preferences. From your Settings dashboard, you can toggle alerts for:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-[15px] text-zinc-400 mb-6">
        <li><strong className="text-white font-medium">Weekly Performance Reviews:</strong> Delivered by 9:00 PM every Sunday.</li>
        <li><strong className="text-white font-medium">Contest Alerts:</strong> Reminders before your favorite matches begin.</li>
        <li><strong className="text-white font-medium">Product Updates:</strong> Important changes or new features added to ErithX.</li>
      </ul>
      <p className="text-[15px] leading-relaxed text-zinc-400 mb-6">
        We do not spam. Notifications are strictly reserved for actionable items that contribute to your preparation.
      </p>

      <div className="mt-16 pt-8 border-t border-white/[0.05] flex justify-between items-center">
        <Link href="/docs/creator-studio" className="text-sm text-white hover:text-emerald-400 flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Creator Studio
        </Link>
        {/* No Next link since this is the last page */}
      </div>
    </section>
  );
}
