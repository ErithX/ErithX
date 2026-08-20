"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import * as Lucide from 'lucide-react';

export default function AboutPage() {
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
      
      <Navbar />
      <div className="">
        

  <main>
    
    {/*  1. THE MISSION (Hero with Full-Width Image & Overlay)  */}
    <section className="relative w-full h-[85vh] min-h-[600px] flex items-end overflow-hidden">
      <Image 
        src="/about-hero.jpg" 
        fill
        sizes="100vw"
        quality={100}
        priority
        className="object-cover" 
        alt="ErithX Workspace" 
      />
      
      {/*  Gradient Overlay for Text Readability & Navbar Visibility  */}
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>

      {/*  Overlay Text Content  */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 pb-16 md:pb-24 w-full">
        <div className="mb-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400">The Mission</span>
        </div>
        
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-medium text-white mb-6 leading-[1.05] max-w-3xl">
          Turning career prep into a <em className="font-normal text-emerald-400">rewarding</em> journey.
        </h1>
        
        <p className="text-base sm:text-lg text-zinc-200 leading-relaxed max-w-xl">
          ErithX is a modern engineering ecosystem built to turn career preparation into an enjoyable, high-value journey, helping students build real technical authority and career visibility.
        </p>
      </div>
    </section>

    {/*  2. THE PROBLEM (Alternating Split Layout)  */}
    <section className="py-20 md:py-32 border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="scroll-reveal">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 block">The Problem</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-zinc-900 mb-6 leading-[1.1]">
              The noise is exhausting.
            </h2>
            <div className="space-y-4 text-base text-zinc-600 leading-relaxed">
              <p>
                Traditional software engineering preparation is often boring, exhausting, and filled with generic internet noise. 
              </p>
              <p>
                Students waste too much time checking dozens of websites manually to find high-quality contests and useful study materials. The system is broken, and the joy of learning is lost in the grind.
              </p>
            </div>
          </div>
          <div className="scroll-reveal">
            <div className="relative w-full aspect-[4/3]">
              <Image src="/about-first.png" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" alt="Student struggling with disorganized study materials and placement anxiety" />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/*  3. THE SOLUTION  */}
    <section className="py-20 md:py-32 border-b border-zinc-100 bg-zinc-50/50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="order-2 md:order-1 scroll-reveal">
            <div className="relative w-full aspect-[4/3]">
              <Image src="/about-second.png" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" alt="ErithX structured ecosystem with live contest tracking and resource hub" />
            </div>
          </div>
          <div className="order-1 md:order-2 scroll-reveal">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-4 block">The Solution</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-zinc-900 mb-6 leading-[1.1]">
              One ecosystem. Zero noise.
            </h2>
            <div className="space-y-4 text-base text-zinc-600 leading-relaxed">
              <p>
                Our platform provides a direct solution by tracking high-quality live contests in one place and offering a dedicated resource hub. 
              </p>
              <p>
                We bring together semester notes, career guidance, and production-ready project ideas—so you can spend less time searching and more time building real technical authority.
              </p>
            </div>
            {/*  Feature Pills  */}
            <div className="flex flex-wrap gap-2 mt-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-zinc-700 text-xs font-medium shadow-sm">
                <Lucide.CalendarCheck className="w-3.5 h-3.5 text-emerald-600" /> Live Contest Tracking
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-zinc-700 text-xs font-medium shadow-sm">
                <Lucide.BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Resource Hub
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-zinc-700 text-xs font-medium shadow-sm">
                <Lucide.Rocket className="w-3.5 h-3.5 text-emerald-600" /> Project Ideas
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/*  4. STUDENT PROJECT STATUS (Large Editorial Quote)  */}
    <section className="py-20 md:py-32 border-b border-zinc-100">
      <div className="max-w-4xl mx-auto px-6 text-center scroll-reveal">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6 block">Status as a Student Project</span>
        <blockquote className="font-display text-2xl sm:text-3xl md:text-5xl font-medium text-zinc-900 leading-[1.2] tracking-tight">
          This platform is an <em className="text-emerald-600 font-normal">independent innovation</em> created to support ambitious engineering students and eliminate general placement anxiety.
        </blockquote>
        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden border-2 border-white">
            <img src="https://picsum.photos/seed/founderavatar/40/40.jpg" className="w-full h-full object-cover" alt="Founder" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-zinc-900">The ErithX Team</div>
            <div className="text-xs text-zinc-500">Built by students, for students</div>
          </div>
        </div>
      </div>
    </section>

    {/*  5. FUTURE ROADMAP  */}
    <section className="py-20 md:py-32 border-b border-zinc-100 bg-zinc-50/50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-16 scroll-reveal">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-4 block">Future Roadmap</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-zinc-900 leading-[1.1]">
            What's coming next?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/*  Roadmap Item 1  */}
          <div className="bg-white rounded-2xl p-8 border border-zinc-100 shadow-sm scroll-reveal">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-6">
              <Lucide.LineChart className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-display text-xl font-medium text-zinc-900 mb-3">Growth Analytics Hub</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              In upcoming development phases, we plan to launch a true growth analytics hub to track skill velocity and visualize progress over time.
            </p>
          </div>
          
          {/*  Roadmap Item 2  */}
          <div className="bg-white rounded-2xl p-8 border border-zinc-100 shadow-sm scroll-reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-6">
              <Lucide.EyeOff className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-display text-xl font-medium text-zinc-900 mb-3">Hidden Challenges</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We will surface hidden recruitment challenges and exclusive opportunities so you never miss a chance to prove your skills to top recruiters.
            </p>
          </div>

          {/*  Roadmap Item 3  */}
          <div className="bg-white rounded-2xl p-8 border border-zinc-100 shadow-sm scroll-reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-6">
              <Lucide.Award className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-display text-xl font-medium text-zinc-900 mb-3">Achievement Cards</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Introduce custom digital achievement cards designed for social media, letting you flex your milestones and consistency authentically.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/*  6. THE TEAM PROFILES  */}
    {false && (
    <section className="py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-16 scroll-reveal">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 block">The Builders</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-zinc-900 leading-[1.1] mb-4">
            Meet the student team.
          </h2>
          <p className="text-base text-zinc-500 max-w-xl mx-auto">
            Independent, passionate, and dedicated to eliminating placement anxiety for engineering students.
          </p>
        </div>

        {/*  Team Grid Placeholder  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/*  Team Member 1  */}
          <div className="team-card bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm scroll-reveal">
            <div className="aspect-[4/5] overflow-hidden bg-zinc-100">
              <img src="https://picsum.photos/seed/dev1/400/500.jpg" className="w-full h-full object-cover img-grayscale" alt="Developer" />
            </div>
            <div className="p-5">
              <h4 className="font-medium text-zinc-900">Name Placeholder</h4>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">Frontend Developer</p>
              <p className="text-xs text-zinc-500 mt-3 leading-relaxed">Built the core UI dashboard and contest tracking interfaces for Phase 1.</p>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-zinc-100">
                <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors"><Lucide.Github className="w-4 h-4" /></a>
                <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors"><Lucide.Linkedin className="w-4 h-4" /></a>
              </div>
            </div>
          </div>

          {/*  Team Member 2  */}
          <div className="team-card bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm scroll-reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="aspect-[4/5] overflow-hidden bg-zinc-100">
              <img src="https://picsum.photos/seed/dev2/400/500.jpg" className="w-full h-full object-cover img-grayscale" alt="Developer" />
            </div>
            <div className="p-5">
              <h4 className="font-medium text-zinc-900">Name Placeholder</h4>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">Backend Developer</p>
              <p className="text-xs text-zinc-500 mt-3 leading-relaxed">Architected the contest aggregation API and resource database logic.</p>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-zinc-100">
                <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors"><Lucide.Github className="w-4 h-4" /></a>
                <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors"><Lucide.Linkedin className="w-4 h-4" /></a>
              </div>
            </div>
          </div>

          {/*  Team Member 3  */}
          <div className="team-card bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm scroll-reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="aspect-[4/5] overflow-hidden bg-zinc-100">
              <img src="https://picsum.photos/seed/dev3/400/500.jpg" className="w-full h-full object-cover img-grayscale" alt="Developer" />
            </div>
            <div className="p-5">
              <h4 className="font-medium text-zinc-900">Name Placeholder</h4>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">UI/UX Designer</p>
              <p className="text-xs text-zinc-500 mt-3 leading-relaxed">Designed the minimalist ecosystem layouts and user experience flows.</p>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-zinc-100">
                <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors"><Lucide.Github className="w-4 h-4" /></a>
                <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors"><Lucide.Linkedin className="w-4 h-4" /></a>
              </div>
            </div>
          </div>

          {/*  Team Member 4  */}
          <div className="team-card bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm scroll-reveal" style={{ transitionDelay: '0.3s' }}>
            <div className="aspect-[4/5] overflow-hidden bg-zinc-100">
              <img src="https://picsum.photos/seed/dev4/400/500.jpg" className="w-full h-full object-cover img-grayscale" alt="Developer" />
            </div>
            <div className="p-5">
              <h4 className="font-medium text-zinc-900">Name Placeholder</h4>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">Full Stack Developer</p>
              <p className="text-xs text-zinc-500 mt-3 leading-relaxed">Integrated platform scrapers and managed deployment infrastructure.</p>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-zinc-100">
                <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors"><Lucide.Github className="w-4 h-4" /></a>
                <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors"><Lucide.Linkedin className="w-4 h-4" /></a>
              </div>
            </div>
          </div>

        </div>
        
        <p className="text-center text-xs text-zinc-400 mt-12 italic max-w-lg mx-auto">
          [Developer Team Profiles Placeholder - Scope: This section will display the names, specific technical roles like frontend or backend developers, personal contributions to the phase 1 features, and direct links to GitHub or LinkedIn profiles for all core student builders].
        </p>
      </div>
    </section>
    )}

  </main>




      </div>
    </div>
  );
}
