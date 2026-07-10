import React from 'react';
import { Star } from 'lucide-react';

export default function Testimonials() {
  return (
    <section id="community" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 scroll-reveal">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3 block">Student Voices</span>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-4">Their words, not ours.</h2>
          <p className="text-sm text-zinc-500 max-w-lg mx-auto">Real stories from students who stopped grinding and started winning.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <div className="feature-card glass rounded-2xl p-6 scroll-reveal">
            <div className="flex items-center gap-1 mb-4">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed mb-6">
              &quot;I used to open 30 tabs every morning trying to track contests. DSA Quest replaced all of them. The milestone cards actually got me a recruiter DM on LinkedIn.&quot;
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <img src="https://picsum.photos/seed/test1/48/48.jpg" className="w-10 h-10 rounded-full object-cover" alt="Arjun Mehta" />
              <div>
                <div className="text-xs font-medium">Arjun Mehta</div>
                <div className="text-[10px] text-zinc-500">III Year, NIT Trichy</div>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="feature-card glass rounded-2xl p-6 scroll-reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="flex items-center gap-1 mb-4">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed mb-6">
              &quot;Every other platform feels like it&apos;s built for some imaginary student. This one gets it. The Gen Z pain points, the AI-era anxiety, the burnout culture — all addressed.&quot;
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <img src="https://picsum.photos/seed/test2/48/48.jpg" className="w-10 h-10 rounded-full object-cover" alt="Sneha Reddy" />
              <div>
                <div className="text-xs font-medium">Sneha Reddy</div>
                <div className="text-[10px] text-zinc-500">II Year, BITS Pilani</div>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="feature-card glass rounded-2xl p-6 scroll-reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="flex items-center gap-1 mb-4">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed mb-6">
              &quot;Cracked Google SDE this year. The interview experience blogs from actual SDEs were gold. The streak system kept me consistent without making me feel guilty on off-days.&quot;
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <img src="https://picsum.photos/seed/test3/48/48.jpg" className="w-10 h-10 rounded-full object-cover" alt="Vikram Singh" />
              <div>
                <div className="text-xs font-medium">Vikram Singh</div>
                <div className="text-[10px] text-zinc-500">IV Year, DTU · SDE @ Google</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
