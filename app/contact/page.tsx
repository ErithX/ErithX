"use client";
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import * as Lucide from 'lucide-react';

export default function ContactPage() {
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

  const [status, setStatus] = React.useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    
    try {
      const response = await fetch("https://formspree.io/f/mlgqojeq", {
        method: "POST",
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setStatus("SUCCESS");
        form.reset();
      } else {
        setStatus("ERROR");
        alert("Oops! There was a problem submitting your form.");
      }
    } catch (error) {
      setStatus("ERROR");
      alert("Oops! There was a problem submitting your form.");
    }
  };

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
        

  <main className="min-h-screen flex items-center justify-center py-20 md:py-32 px-6 sm:px-8">
    <div className="max-w-6xl mx-auto w-full">
      
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        
        {/*  LEFT COLUMN: Information  */}
        <div className="scroll-reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Get in Touch</span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium text-zinc-900 mb-6 leading-[1.05]">
            Let's build the <em className="font-normal text-emerald-600">future</em> of engineering prep.
          </h1>
          
          <p className="text-base text-zinc-500 leading-relaxed mb-10 max-w-md">
            Have a question, a partnership idea, or just want to share feedback? We usually respond within 24 hours.
          </p>

          {/*  Contact Details  */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-1">
                <Lucide.Mail className="w-4 h-4 text-zinc-600" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-zinc-400 mb-1">Email Us</div>
                <a href="mailto:founder@erithx.dev" className="text-lg font-medium text-zinc-900 link-underline">founder@erithx.dev</a>
                <p className="text-sm text-zinc-500 mt-1">For general inquiries and support.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-1">
                <Lucide.MessageCircle className="w-4 h-4 text-zinc-600" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-zinc-400 mb-1">Community</div>
                <a href="#" className="text-lg font-medium text-zinc-900 link-underline">Join our Discord</a>
                <p className="text-sm text-zinc-500 mt-1">Chat with 4,800+ students and pros.</p>
              </div>
            </div>
          </div>

          {/*  Socials  */}
          <div className="mt-12 pt-8 border-t border-zinc-100">
            <div className="text-xs uppercase tracking-widest text-zinc-400 mb-4">Follow the journey</div>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-900 text-zinc-600 hover:text-white flex items-center justify-center transition-colors duration-300">
                <Lucide.Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-900 text-zinc-600 hover:text-white flex items-center justify-center transition-colors duration-300">
                <Lucide.Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-900 text-zinc-600 hover:text-white flex items-center justify-center transition-colors duration-300">
                <Lucide.Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/*  RIGHT COLUMN: The Form  */}
        <div className="scroll-reveal">
          <div className="bg-zinc-50 rounded-3xl p-8 sm:p-10 border border-zinc-100 shadow-sm">
            
            {status === "SUCCESS" ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                  <Lucide.CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-display text-3xl font-medium text-zinc-900 mb-3">Message Sent!</h3>
                <p className="text-sm text-zinc-500 max-w-xs mb-8">
                  Thanks for reaching out. We'll get back to you within 24 hours.
                </p>
                <button onClick={() => setStatus('')} className="text-sm text-zinc-900 font-semibold link-underline">
                  Send another message
                </button>
              </div>
            ) : (
              <form id="contactForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2 block">First Name</label>
                    <input type="text" name="First Name" required className="form-input w-full px-4 py-3 rounded-xl text-sm text-zinc-900" placeholder="Arjun" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2 block">Last Name</label>
                    <input type="text" name="Last Name" required className="form-input w-full px-4 py-3 rounded-xl text-sm text-zinc-900" placeholder="Mehta" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2 block">Email Address</label>
                  <input type="email" name="Email" required className="form-input w-full px-4 py-3 rounded-xl text-sm text-zinc-900" placeholder="you@college.edu" />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2 block">What's this about?</label>
                  <select name="Subject" required className="form-input w-full px-4 py-3 rounded-xl text-sm text-zinc-900 appearance-none cursor-pointer" defaultValue="">
                    <option value="" disabled >Select a topic...</option>
                    <option>General Inquiry</option>
                    <option>Partnership / Collaboration</option>
                    <option>Bug Report / Feedback</option>
                    <option>Resource Contribution</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2 block">Message</label>
                  <textarea name="Message" required rows={5} className="form-input w-full px-4 py-3 rounded-xl text-sm text-zinc-900 resize-none" placeholder="Tell us what's on your mind..."></textarea>
                </div>

                <button type="submit" className="submit-btn w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-zinc-900 text-white text-sm font-semibold">
                  Send Message
                  <Lucide.ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  </main>




      </div>
    </div>
  );
}
