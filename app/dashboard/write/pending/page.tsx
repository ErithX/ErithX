"use client";

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Mail, Clock, MessageSquare, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9] text-[#1e293b] p-4 overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Import the Google Font for this specific page if not global */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .confetti { position: absolute; pointer-events: none; }
        .c-1 { width: 8px; height: 8px; background: #ff5b5b; transform: rotate(45deg); top: 15%; left: 10%; }
        .c-2 { width: 6px; height: 6px; background: #3b82f6; border-radius: 50%; top: 20%; left: 30%; }
        .c-3 { width: 10px; height: 10px; background: #fbbf24; clip-path: polygon(50% 0%, 0% 100%, 100% 100%); top: 35%; left: 15%; }
        .c-4 { width: 8px; height: 8px; background: #34d399; transform: rotate(15deg); top: 10%; right: 25%; }
        .c-5 { width: 7px; height: 7px; background: #8b5cf6; border-radius: 50%; top: 30%; right: 10%; }
        .c-6 { width: 8px; height: 8px; background: #fbbf24; transform: rotate(45deg); top: 50%; left: 5%; }
        .c-7 { width: 6px; height: 6px; background: #ff5b5b; border-radius: 50%; top: 60%; right: 15%; }
        .c-8 { width: 10px; height: 10px; border: 2px solid #8b5cf6; border-radius: 50%; top: 15%; left: 45%; }
        .wave-bg {
          position: absolute; bottom: 0; left: 0; right: 0; height: 80px; z-index: 0;
          background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg"><path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="%23f8fafc"/></svg>') no-repeat bottom;
          background-size: cover;
        }
      `}} />

      <div className="max-w-[850px] w-full bg-white rounded-[2rem] shadow-xl overflow-hidden relative flex flex-col max-h-[95vh] md:max-h-[90vh]">
        
        {/* Top Section (White background with confetti) */}
        <div className="p-6 md:p-8 relative flex-1">
          {/* Confetti Elements */}
          <div className="confetti c-1 animate-in zoom-in duration-700 delay-100"></div>
          <div className="confetti c-2 animate-in zoom-in duration-700 delay-200"></div>
          <div className="confetti c-3 animate-in zoom-in duration-700 delay-300"></div>
          <div className="confetti c-4 animate-in zoom-in duration-700 delay-[400ms]"></div>
          <div className="confetti c-5 animate-in zoom-in duration-700 delay-[500ms]"></div>
          <div className="confetti c-6 animate-in zoom-in duration-700 delay-[600ms]"></div>
          <div className="confetti c-7 animate-in zoom-in duration-700 delay-150"></div>
          <div className="confetti c-8 animate-in zoom-in duration-700 delay-250"></div>

          <div className="grid md:grid-cols-2 gap-4 items-center relative z-10 h-full">
            
            {/* Left Content */}
            <div className="space-y-3 animate-in slide-in-from-left-8 duration-700 fade-in">
              <div className="w-12 h-12 bg-[#22c55e] rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(34,197,94,0.3)] mb-4">
                <Check className="w-6 h-6 text-white stroke-[3]" />
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1e293b] leading-tight">
                  Your Form <br/>
                  <span className="text-[#22c55e]">Submitted!</span>
                </h1>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-[280px] mt-3">
                  Thank you for reaching out. We've received your information and will get back to you soon.
                </p>
                <div className="mt-4 pt-4">
                  <p className="font-bold text-[#4f46e5] text-sm flex items-center gap-1">
                    Hello there! 👋
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    We're excited to connect with you.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative h-[180px] md:h-[240px] flex items-center justify-center animate-in slide-in-from-right-8 duration-700 fade-in delay-150">
              <Image 
                src="/form-submission-2.webp" 
                fill 
                className="object-contain" 
                alt="Form Submission Success Illustration" 
                priority
              />
            </div>
          </div>
          
          <div className="wave-bg animate-in fade-in duration-1000"></div>
        </div>

        {/* Bottom Section */}
        <div className="bg-[#f8fafc] px-6 md:px-8 pb-8 pt-4 relative z-10 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-[#22c55e] font-bold text-xs">→</span>
            <h3 className="text-[#1e293b] font-bold text-[11px] tracking-wider uppercase">Here's what happens next</h3>
            <span className="text-[#22c55e] font-bold text-xs">←</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Card 1 */}
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center mb-2">
                <Mail className="w-4 h-4 text-[#22c55e]" />
              </div>
              <h4 className="font-bold text-[#1e293b] text-[11px] mb-1">Confirmation Email</h4>
              <p className="text-slate-400 text-[9px] leading-relaxed hidden sm:block">
                You will receive a confirmation email shortly.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
              <h4 className="font-bold text-[#1e293b] text-[11px] mb-1">Our Team Reviews</h4>
              <p className="text-slate-400 text-[9px] leading-relaxed hidden sm:block">
                We'll review your details and get in touch.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center mb-2">
                <MessageSquare className="w-4 h-4 text-purple-500" />
              </div>
              <h4 className="font-bold text-[#1e293b] text-[11px] mb-1">Stay Updated</h4>
              <p className="text-slate-400 text-[9px] leading-relaxed hidden sm:block">
                We'll keep you updated on the next steps.
              </p>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="mt-6 text-center">
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#5d5fef] hover:bg-[#4b4dcf] text-white text-xs font-bold transition-all shadow-[0_4px_14px_rgba(93,95,239,0.39)] hover:-translate-y-0.5">
              Back to Home
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PendingApprovalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f9fafc]"></div>}>
      <PendingContent />
    </Suspense>
  );
}
