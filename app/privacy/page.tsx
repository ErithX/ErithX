"use client";
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import * as Lucide from 'lucide-react';

export default function PrivacyPage() {
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
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-emerald-500/30 selection:text-white relative overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
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
      `}} />
      
<div className="absolute inset-0" style={{background: 'radial-gradient(ellipse at bottom, rgba(6,78,59,0.15), #09090b 60%)'}}></div>
<div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-[0.06]" style={{background: 'radial-gradient(circle, #10b981, transparent 70%)'}}></div>

      <Navbar />
      <div className="">
        

  <main className="relative">
    {/*  Background effect  */}
    <div className="absolute inset-0 grid-bg opacity-50"></div>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)', filter: 'blur(80px)' }}></div>

    <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 py-20 md:py-32">
      
      {/*  Header  */}
      <header className="mb-16 pb-10 border-b border-white/5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
          <Lucide.ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Legal Document</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tighter text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-zinc-500">
          Last updated: June 24, 2026
        </p>
      </header>

      {/*  Intro  */}
      <div className="mb-16 text-base text-zinc-400 leading-relaxed">
        <p>
          At DSA Quest, accessible from dsaquest.com, the privacy of our visitors is one of our main priorities. This Privacy Policy document outlines the types of information that is collected and recorded by DSA Quest and how we use it.
        </p>
        <p className="mt-4">
          By using our platform, you hereby consent to our Privacy Policy and agree to its terms.
        </p>
      </div>

      {/*  Sections  */}
      <div className="space-y-16">

        {/*  1. Information We Collect  */}
        <section id="information-we-collect">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lucide.Database className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">1. Information We Collect</h2>
          </div>
          <div className="space-y-4 pl-2 sm:pl-11 text-sm text-zinc-400 leading-relaxed">
            <p>
              We believe in minimal data collection. We only collect your <span className="text-zinc-200 font-medium">email address</span> when you log in to our platform. 
            </p>
            <p>
              We do not collect sensitive personal information such as phone numbers, physical addresses, or payment details. Our goal is to provide a safe, frictionless experience.
            </p>
          </div>
        </section>

        {/*  2. How We Collect Data  */}
        <section id="how-we-collect">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lucide.LogIn className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">2. How We Collect Data</h2>
          </div>
          <div className="space-y-4 pl-2 sm:pl-11 text-sm text-zinc-400 leading-relaxed">
            <p>
              We collect your email address automatically when you choose to sign up or log in using <span className="text-zinc-200 font-medium">Google Authentication</span>. This process is securely handled by our backend infrastructure partner, Supabase.
            </p>
            <p>
              We do not use invasive tracking cookies to monitor your behavior across other websites. If we implement analytics in the future to understand platform usage, it will be strictly anonymized.
            </p>
          </div>
        </section>

        {/*  3. Why We Need Your Data  */}
        <section id="why-we-need-data">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lucide.Mail className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">3. Why We Need Your Data</h2>
          </div>
          <div className="space-y-4 pl-2 sm:pl-11 text-sm text-zinc-400 leading-relaxed">
            <p>
              The email address we collect is used solely for the following operational purposes:
            </p>
            <ul className="space-y-2 list-disc list-inside text-zinc-400">
              <li>To create and authenticate your user account.</li>
              <li>To send you regular contest alerts so you never miss an opportunity.</li>
              <li>To send critical updates regarding your account or our terms of service.</li>
            </ul>
            <p>
              We do not use your email for unsolicited marketing, spam, or promotional newsletters from third parties.
            </p>
          </div>
        </section>

        {/*  4. Data Sharing & Disclosure  */}
        <section id="data-sharing">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lucide.Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">4. Data Sharing & Disclosure</h2>
          </div>
          <div className="space-y-4 pl-2 sm:pl-11 text-sm text-zinc-400 leading-relaxed">
            <p>
              We do not share, sell, rent, or trade your personal data with anyone. Your email address is kept strictly internal and is only used to deliver the core features of DSA Quest.
            </p>
            <p>
              We may share data only if legally compelled to do so by law enforcement or government agencies, though this is highly unlikely for a platform that only stores an email address.
            </p>
          </div>
        </section>

        {/*  5. Data Security  */}
        <section id="data-security">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lucide.Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">5. Data Security</h2>
          </div>
          <div className="space-y-4 pl-2 sm:pl-11 text-sm text-zinc-400 leading-relaxed">
            <p>
              Your data is securely stored and protected by <span className="text-zinc-200 font-medium">Supabase</span>, an enterprise-grade backend provider that handles all our authentication and database security measures. 
            </p>
            <p>
              Supabase employs robust security protocols, including encryption at rest and in transit, ensuring that your email address is protected against unauthorized access, alteration, or disclosure.
            </p>
          </div>
        </section>

        {/*  6. Your Rights  */}
        <section id="your-rights">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lucide.UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">6. Your Data Rights</h2>
          </div>
          <div className="space-y-4 pl-2 sm:pl-11 text-sm text-zinc-400 leading-relaxed">
            <p>
              You have complete control over your data. Under standard data protection principles, you have the right to:
            </p>
            <ul className="space-y-2 list-disc list-inside text-zinc-400">
              <li>Access the data we hold about you (specifically, your email address).</li>
              <li>Request correction of any inaccurate personal data.</li>
              <li>Request the deletion of your account and data from our system.</li>
            </ul>
            <p>
              If you wish to exercise any of these rights, simply contact us, and we will process your request immediately without unnecessary delay.
            </p>
          </div>
        </section>

        {/*  7. Changes to This Policy  */}
        <section id="policy-changes">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lucide.RefreshCw className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">7. Changes to This Policy</h2>
          </div>
          <div className="space-y-4 pl-2 sm:pl-11 text-sm text-zinc-400 leading-relaxed">
            <p>
              We may update our Privacy Policy from time to time as our platform evolves. Any changes will reflect our ongoing commitment to privacy and security.
            </p>
            <p>
              We will notify you of any major changes by posting the new Privacy Policy directly on this page and updating the "Last updated" date at the top. You are advised to review this page periodically for any updates.
            </p>
          </div>
        </section>

        {/*  8. Contact Information  */}
        <section id="contact">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lucide.MessageSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">8. Contact Information</h2>
          </div>
          <div className="space-y-4 pl-2 sm:pl-11 text-sm text-zinc-400 leading-relaxed">
            <p>
              If you have any questions about this Privacy Policy, or if you wish to request the deletion of your email and account data, please reach out to us directly.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10">
              <Lucide.Mail className="w-4 h-4 text-emerald-400" />
              <a href="mailto:debjyoti2409@gmail.com" className="text-zinc-200 font-medium link-underline">debjyoti2409@gmail.com</a>
            </div>
          </div>
        </section>

      </div>

      {/*  Footer Note  */}
      <footer className="mt-20 pt-8 border-t border-white/5 text-center">
        <p className="text-[10px] uppercase tracking-widest text-zinc-600">
          © 2026 DSA Quest. Built for students, backed by pros.
        </p>
      </footer>

    </div>
  </main>




      </div>
    </div>
  );
}
