"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import * as Lucide from 'lucide-react';

export default function FaqPage() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#18181b] selection:bg-emerald-500/30 selection:text-white relative overflow-hidden">
      <style dangerouslySetInnerHTML={
        {__html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&display=swap');
        .font-display { font-family: 'Fraunces', serif; letter-spacing: -0.02em; }
        .img-grayscale { filter: grayscale(100%); transition: filter 0.6s ease; }
        .img-grayscale:hover { filter: grayscale(0%); }
        .team-card { transition: all 300ms ease; }
        .team-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -10px rgba(0,0,0,0.1); }
        .scroll-reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .scroll-reveal.visible { opacity: 1; transform: translateY(0); }
        .faq-item[open] .faq-icon { transform: rotate(180deg); }
        .faq-item > summary { list-style: none; }
        .faq-item > summary::-webkit-details-marker { display: none; }
        .submit-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px -10px rgba(0,0,0,0.2); }
      `}
      } />
      
      <Navbar />
      <div className="">
        

  <main>
    
    {/*  1. HERO SECTION WITH TOP IMAGE  */}
    <section className="relative w-full h-[45vh] min-h-[340px] flex items-end overflow-hidden">
      <Image 
        src="/FAQ-Desktop.png" 
        fill 
        sizes="100vw"
        priority
        className="object-cover" 
        alt="Frequently Asked Questions background showing people collaborating" 
      />
      
      {/*  Gradient Overlays for text visibility  */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>

      {/*  Overlay Text Content  */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 pb-12 md:pb-16 w-full">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)] text-zinc-300">
          <Lucide.HelpCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold tracking-wider uppercase">Support Center</span>
        </div>
        
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium text-white mb-4 leading-[1.05]">
          Frequently asked <em className="font-normal text-emerald-400">questions.</em>
        </h1>
        
        <p className="text-base sm:text-lg text-zinc-200 leading-relaxed max-w-xl">
          Everything you need to know about DSA Quest, contest tracking, and your account.
        </p>
      </div>
    </section>

    {/*  2. FAQ ACCORDION SECTION  */}
    <section className="py-20 md:py-32">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        
        {/*  SEO-friendly Accordion using native HTML details/summary  */}
        <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">

          {/*  Item 1  */}
          <details className="faq-item group" open>
            <summary className="flex items-center justify-between p-6 sm:p-8">
              <h2 className="font-display text-lg sm:text-xl font-medium text-zinc-900 pr-4">What is DSA Quest?</h2>
              <div className="accordion-icon flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                <Lucide.Plus className="w-4 h-4 text-zinc-600" />
              </div>
            </summary>
            <div className="answer-content px-6 sm:px-8">
              <p className="text-sm text-zinc-600 leading-relaxed">
                It is a modern engineering platform designed to help students track high-quality coding contests, access academic resources, and prepare for tech careers without the boring grind. We focus on preparation with intent, not burnout.
              </p>
            </div>
          </details>

          {/*  Item 2  */}
          <details className="faq-item group">
            <summary className="flex items-center justify-between p-6 sm:p-8">
              <h2 className="font-display text-lg sm:text-xl font-medium text-zinc-900 pr-4">Is this platform free to use?</h2>
              <div className="accordion-icon flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                <Lucide.Plus className="w-4 h-4 text-zinc-600" />
              </div>
            </summary>
            <div className="answer-content px-6 sm:px-8">
              <p className="text-sm text-zinc-600 leading-relaxed">
                Yes, all the features available in Phase 1, including the contest tracker and the resource hub, are completely free for students. We believe in building an accessible ecosystem without paywalls.
              </p>
            </div>
          </details>

          {/*  Item 2.5 (Calendar Sync)  */}
          <details className="faq-item group">
            <summary className="flex items-center justify-between p-6 sm:p-8">
              <h2 className="font-display text-lg sm:text-xl font-medium text-zinc-900 pr-4">Can I add contests to my personal calendar?</h2>
              <div className="accordion-icon flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                <Lucide.Plus className="w-4 h-4 text-zinc-600" />
              </div>
            </summary>
            <div className="answer-content px-6 sm:px-8">
              <p className="text-sm text-zinc-600 leading-relaxed">
                Yes! Every contest on our tracker comes with a 1-click 'Add to Calendar' button. You can instantly sync any LeetCode, Codeforces, or CodeChef event directly to your Google Calendar, Apple Calendar, or Outlook so you never miss a start time.
              </p>
            </div>
          </details>

          {/*  Item 2.6 (Connecting Coding Profiles)  */}
          <details className="faq-item group">
            <summary className="flex items-center justify-between p-6 sm:p-8">
              <h2 className="font-display text-lg sm:text-xl font-medium text-zinc-900 pr-4">How do I connect my LeetCode, GitHub, or Codeforces accounts?</h2>
              <div className="accordion-icon flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                <Lucide.Plus className="w-4 h-4 text-zinc-600" />
              </div>
            </summary>
            <div className="answer-content px-6 sm:px-8">
              <p className="text-sm text-zinc-600 leading-relaxed">
                Navigate to your <strong>Dashboard ➔ Settings ➔ Coding Profiles</strong>. Simply paste your profile URL or username for LeetCode, GitHub, or Codeforces. Our edge verification engine will automatically check and sync your profile with zero manual saving required.
              </p>
            </div>
          </details>

          {/*  Item 2.7 (Why Connect Profiles)  */}
          <details className="faq-item group">
            <summary className="flex items-center justify-between p-6 sm:p-8">
              <h2 className="font-display text-lg sm:text-xl font-medium text-zinc-900 pr-4">Why should I connect my coding profiles?</h2>
              <div className="accordion-icon flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                <Lucide.Plus className="w-4 h-4 text-zinc-600" />
              </div>
            </summary>
            <div className="answer-content px-6 sm:px-8">
              <p className="text-sm text-zinc-600 leading-relaxed">
                Connecting your profiles powers your AI Progress Reviewer. It automatically monitors your contest rating deltas, problem-solving velocity, and GitHub project commits to deliver brutally honest weekly feedback without requiring manual progress logs or passwords.
              </p>
            </div>
          </details>

          {/*  Item 3  */}
          <details className="faq-item group">
            <summary className="flex items-center justify-between p-6 sm:p-8">
              <h2 className="font-display text-lg sm:text-xl font-medium text-zinc-900 pr-4">What resources can I find here?</h2>

              <div className="accordion-icon flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                <Lucide.Plus className="w-4 h-4 text-zinc-600" />
              </div>
            </summary>
            <div className="answer-content px-6 sm:px-8">
              <p className="text-sm text-zinc-600 leading-relaxed">
                We provide curated engineering blueprints, system architecture PDFs, 2026 tech career roadmaps, and production-ready project guides to help you build real technical authority. All resources are curated by verified engineers and contributors.
              </p>
            </div>
          </details>

          {/*  Item 4  */}
          <details className="faq-item group">
            <summary className="flex items-center justify-between p-6 sm:p-8">
              <h2 className="font-display text-lg sm:text-xl font-medium text-zinc-900 pr-4">How do I log in to the platform?</h2>
              <div className="accordion-icon flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                <Lucide.Plus className="w-4 h-4 text-zinc-600" />
              </div>
            </summary>
            <div className="answer-content px-6 sm:px-8">
              <p className="text-sm text-zinc-600 leading-relaxed">
                You can easily sign up or log in using your existing Google account through our secure Supabase authentication. No need to remember another password—just one click and you're in.
              </p>
            </div>
          </details>

          {/*  Item 5  */}
          <details className="faq-item group">
            <summary className="flex items-center justify-between p-6 sm:p-8">
              <h2 className="font-display text-lg sm:text-xl font-medium text-zinc-900 pr-4">How do you use my email address?</h2>
              <div className="accordion-icon flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                <Lucide.Plus className="w-4 h-4 text-zinc-600" />
              </div>
            </summary>
            <div className="answer-content px-6 sm:px-8">
              <p className="text-sm text-zinc-600 leading-relaxed">
                We only use your email to create your account and send you regular contest alerts. We never sell or share your data with anyone else. Your privacy is paramount to us.
              </p>
            </div>
          </details>

          {/*  Item 6  */}
          <details className="faq-item group">
            <summary className="flex items-center justify-between p-6 sm:p-8">
              <h2 className="font-display text-lg sm:text-xl font-medium text-zinc-900 pr-4">How can I request to delete my account and data?</h2>
              <div className="accordion-icon flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                <Lucide.Plus className="w-4 h-4 text-zinc-600" />
              </div>
            </summary>
            <div className="answer-content px-6 sm:px-8">
              <p className="text-sm text-zinc-600 leading-relaxed">
                If you want to delete your account or remove your email from our system, simply send an email to <a href="mailto:debjyoti2409@gmail.com" className="text-emerald-600 font-medium underline">debjyoti2409@gmail.com</a> and we will process it immediately. We believe in the right to be forgotten.
              </p>
            </div>
          </details>

          {/*  Item 7  */}
          <details className="faq-item group">
            <summary className="flex items-center justify-between p-6 sm:p-8">
              <h2 className="font-display text-lg sm:text-xl font-medium text-zinc-900 pr-4">What features are coming in the future?</h2>
              <div className="accordion-icon flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                <Lucide.Plus className="w-4 h-4 text-zinc-600" />
              </div>
            </summary>
            <div className="answer-content px-6 sm:px-8">
              <p className="text-sm text-zinc-600 leading-relaxed">
                We are working on an analytics hub to track true skill growth, hidden hiring challenge alerts, and professional profile cards to share on social media. The grand vision is to become the definitive starter pack for every tech student.
              </p>
            </div>
          </details>

          {/*  Item 8  */}
          <details className="faq-item group">
            <summary className="flex items-center justify-between p-6 sm:p-8">
              <h2 className="font-display text-lg sm:text-xl font-medium text-zinc-900 pr-4">How can I report a bug or give feedback?</h2>
              <div className="accordion-icon flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                <Lucide.Plus className="w-4 h-4 text-zinc-600" />
              </div>
            </summary>
            <div className="answer-content px-6 sm:px-8">
              <p className="text-sm text-zinc-600 leading-relaxed">
                You can reach out to us directly via our support email or connect with us on our social media links listed on the Contact Us page. We are an independent project and actively listen to community feedback to shape our roadmap.
              </p>
            </div>
          </details>

        </div>

        {/*  Still have questions? CTA  */}
        <div className="mt-16 text-center bg-zinc-50 border border-zinc-100 rounded-2xl p-10">
          <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <Lucide.HelpCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-display text-2xl font-medium text-zinc-900 mb-2">Still have questions?</h3>
          <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">
            Can't find the answer you're looking for? Please reach out to our team.
          </p>
          <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors">
            Contact Support
            <Lucide.ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  </main>




      </div>
    </div>
  );
}
