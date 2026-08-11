"use client";

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

function PendingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('submitted') !== 'true') {
      router.push('/dashboard/write');
    }
  }, [searchParams, router]);

  if (searchParams.get('submitted') !== 'true') return null;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-emerald-500/30">
      
      {/* Subtle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out max-w-lg">
        
        {/* Success Icon */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
          <CheckCircle2 className="w-20 h-20 text-emerald-400 relative z-10" strokeWidth={1.5} />
        </div>

        {/* Large Typography */}
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-6">
          Submission <span className="text-emerald-400">Received.</span>
        </h1>

        <p className="text-zinc-400 text-lg mb-12 max-w-md mx-auto leading-relaxed font-light">
          Your document has been securely routed for review. We will notify you once it's published.
        </p>

        {/* Action Button */}
        <Link 
          href="/dashboard"
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 rounded-full text-sm font-semibold tracking-wide transition-all border border-zinc-800 hover:border-zinc-700"
        >
          Return to Dashboard
          <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export default function PendingApprovalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black"></div>}>
      <PendingContent />
    </Suspense>
  );
}
