"use client";

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

function PendingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('submitted') !== 'true') {
      router.push('/dashboard/pro');
    }
  }, [searchParams, router]);

  if (searchParams.get('submitted') !== 'true') return null; // Prevent flash

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-white selection:bg-emerald-800 selection:text-white relative overflow-hidden p-6 font-sans">
      
      {/* Ambient Background Effects */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.08), transparent 70%)' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>

      <div className="relative z-10 max-w-lg w-full text-center space-y-8 animate-in slide-in-from-bottom-8 duration-700 fade-in">

        
        {/* Icon Container */}
        <div className="mx-auto w-24 h-24 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center relative shadow-2xl backdrop-blur-sm">
          <div className="absolute inset-0 rounded-3xl border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]"></div>
          <Sparkles className="w-10 h-10 text-emerald-400" />
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent pb-1">
            Masterpiece Submitted
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-sm mx-auto leading-relaxed">
            Thank you for sharing your expertise. Our curators are reviewing your resource to ensure it meets the DSA Quest standard of excellence.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 gap-4 mt-8 text-left">
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 backdrop-blur-md">
            <Clock className="w-5 h-5 text-zinc-500" />
            <div>
              <div className="text-sm font-semibold text-zinc-200">24-48 Hours</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Average review time</div>
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 backdrop-blur-md">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <div>
              <div className="text-sm font-semibold text-zinc-200">Quality Assured</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Preserving the ecosystem</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-8">
          <Link href="/dashboard/pro" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-zinc-900 text-sm font-bold hover:bg-zinc-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 duration-200 group">
            Return to Creator Studio
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function PendingApprovalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090b]"></div>}>
      <PendingContent />
    </Suspense>
  );
}
