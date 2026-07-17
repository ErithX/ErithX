"use client";
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import * as Lucide from 'lucide-react';

export default function TermsPage() {
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
          <Lucide.FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Legal Document</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tighter text-white mb-4">
          Terms & Conditions
        </h1>
        <p className="text-sm text-zinc-500">
          Last updated: June 24, 2026
        </p>
      </header>

      {/*  Intro  */}
      <div className="mb-16 text-base text-zinc-400 leading-relaxed">
        <p>
          Welcome to DSA Quest. These Terms and Conditions ("Terms") outline the rules and regulations for using our platform. 
        </p>
        <p className="mt-4">
          By accessing this website and logging in, we assume you agree to these terms in full. Do not continue to use DSA Quest if you do not accept all of the terms and conditions stated on this page.
        </p>
      </div>

      {/*  Sections  */}
      <div className="space-y-16">

        {/*  1. Acceptance of Terms  */}
        <section id="acceptance-of-terms">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lucide.CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">1. Acceptance of Terms</h2>
          </div>
          <div className="space-y-4 pl-2 sm:pl-11 text-sm text-zinc-400 leading-relaxed">
            <p>
              By logging in with Google Authentication and accessing the DSA Quest platform, you automatically agree to be bound by all the rules, policies, and guidelines outlined on this page. 
            </p>
            <p>
              If you do not agree with any part of these Terms, you must not log in or use our services. Your continued use of the platform constitutes ongoing acceptance of these Terms.
            </p>
          </div>
        </section>

        {/*  2. Purpose of the Service  */}
        <section id="purpose-of-service">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lucide.Target className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">2. Purpose of the Service</h2>
          </div>
          <div className="space-y-4 pl-2 sm:pl-11 text-sm text-zinc-400 leading-relaxed">
            <p>
              DSA Quest is an independent project designed to provide automated and regular coding contest alerts, curate academic resources, and offer career guidance.
            </p>
            <p>
              The platform is built strictly for informational and educational purposes to assist engineering students in their preparation. It is not a certified educational institution, and using our services does not guarantee employment, placement, or success in any specific contest.
            </p>
          </div>
        </section>

        {/*  3. Account Termination  */}
        <section id="account-termination">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lucide.UserX className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">3. Account Termination</h2>
          </div>
          <div className="space-y-4 pl-2 sm:pl-11 text-sm text-zinc-400 leading-relaxed">
            <p>
              We reserve the absolute right to suspend, block, or permanently delete your account and associated data without prior notice if we determine that you have:
            </p>
            <ul className="space-y-2 list-disc list-inside text-zinc-400">
              <li>Attempted to spam, overload, or crash our servers.</li>
              <li>Misused the platform by scraping, reverse engineering, or exploiting vulnerabilities.</li>
              <li>Disrupted the service for other users or engaged in malicious activity.</li>
              <li>Violated the intellectual property rights of others.</li>
            </ul>
            <p>
              You are solely responsible for maintaining the confidentiality of your Google Authentication session.
            </p>
          </div>
        </section>

        {/*  4. Intellectual Property  */}
        <section id="intellectual-property">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lucide.Copyright className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">4. Intellectual Property</h2>
          </div>
          <div className="space-y-4 pl-2 sm:pl-11 text-sm text-zinc-400 leading-relaxed">
            <p>
              All code, software, UI/UX design, logos, graphics, and unique features displayed on DSA Quest belong entirely to Debjyoti and the DSA Quest development team. 
            </p>
            <p>
              You may not copy, reproduce, republish, download, or distribute any material from this platform for commercial purposes without explicit written permission. Unauthorized use of our intellectual property is a violation of applicable copyright and trademark laws.
            </p>
          </div>
        </section>

        {/*  5. Limitation of Liability  */}
        <section id="limitation-of-liability">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lucide.ShieldAlert className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">5. Limitation of Liability (No Guarantees)</h2>
          </div>
          <div className="space-y-4 pl-2 sm:pl-11 text-sm text-zinc-400 leading-relaxed">
            <p>
              The DSA Quest platform is provided on an "as is" and "as available" basis. We are a student team, and while we strive for excellence, we make no absolute guarantees regarding uptime, reliability, or accuracy.
            </p>
            <p>
              Under no circumstances shall we be held legally or financially responsible if:
            </p>
            <ul className="space-y-2 list-disc list-inside text-zinc-400">
              <li>A contest alert is delayed, missed, or displays incorrect information.</li>
              <li>The platform faces temporary downtime, maintenance, or server crashes.</li>
              <li>You suffer any loss or damage resulting from your reliance on information provided by this site.</li>
            </ul>
          </div>
        </section>

        {/*  6. Third-Party Services  */}
        <section id="third-party-services">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lucide.ExternalLink className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">6. Third-Party Services</h2>
          </div>
          <div className="space-y-4 pl-2 sm:pl-11 text-sm text-zinc-400 leading-relaxed">
            <p>
              Our platform relies on third-party infrastructure to function. Specifically, user authentication is powered by <span className="text-zinc-200 font-medium">Supabase</span> and <span className="text-zinc-200 font-medium">Google OAuth</span>.
            </p>
            <p>
              DSA Quest is not responsible for any service disruptions, data breaches, or technical failures that originate from these external systems. By using our site, you also agree to the terms and privacy policies of Google and Supabase.
            </p>
          </div>
        </section>

        {/*  7. Changes to the Terms  */}
        <section id="changes-to-terms">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lucide.RefreshCw className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">7. Changes to the Terms</h2>
          </div>
          <div className="space-y-4 pl-2 sm:pl-11 text-sm text-zinc-400 leading-relaxed">
            <p>
              We reserve the right to update, modify, or revise these Terms and Conditions at any time to reflect changes in our practices, legal requirements, or platform features.
            </p>
            <p>
              Any changes will be posted directly on this page with an updated "Last updated" date. It is your responsibility to review this page periodically. Your continued use of the website after any changes signifies your acceptance of the new Terms.
            </p>
          </div>
        </section>

        {/*  8. Contact for Disputes  */}
        <section id="contact-for-disputes">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lucide.Mail className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">8. Contact for Disputes</h2>
          </div>
          <div className="space-y-4 pl-2 sm:pl-11 text-sm text-zinc-400 leading-relaxed">
            <p>
              If you have any questions, legal inquiries, or complaints regarding these Terms and Conditions, or if you wish to raise a dispute, please contact us directly.
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
