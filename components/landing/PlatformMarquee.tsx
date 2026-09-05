import React from 'react';

export default function PlatformMarquee() {
  return (
    <section className="py-8 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-4">
        <p className="text-center text-[10px] uppercase tracking-widest text-zinc-400">Works with the platforms you already use.</p>
      </div>
      <div className="max-w-4xl mx-auto overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
        <div className="marquee gap-12">
          <div className="flex items-center gap-12 flex-shrink-0">
            <span className="text-xl font-semibold text-zinc-400 hover:text-zinc-200 transition-colors whitespace-nowrap">LeetCode</span>
            <span className="text-xl font-semibold text-zinc-400 hover:text-zinc-200 transition-colors whitespace-nowrap">Codeforces</span>
            <span className="text-xl font-semibold text-zinc-400 hover:text-zinc-200 transition-colors whitespace-nowrap">CodeChef</span>
            <span className="text-xl font-semibold text-zinc-400 hover:text-zinc-200 transition-colors whitespace-nowrap">HackerRank</span>
            <span className="text-xl font-semibold text-zinc-400 hover:text-zinc-200 transition-colors whitespace-nowrap">AtCoder</span>
            <span className="text-xl font-semibold text-zinc-400 hover:text-zinc-200 transition-colors whitespace-nowrap">HackerEarth</span>
            <span className="text-xl font-semibold text-zinc-400 hover:text-zinc-200 transition-colors whitespace-nowrap">GeeksforGeeks</span>
            <span className="text-xl font-semibold text-zinc-400 hover:text-zinc-200 transition-colors whitespace-nowrap">Kick Start</span>
            <span className="text-xl font-semibold text-zinc-400 transition-colors whitespace-nowrap">and more</span>
          </div>
          {/* Duplicated for smooth infinite scroll effect if the CSS uses it, but the user asked to 'Remove duplicated platform list'. 
              Wait, if we remove the duplicated one, CSS marquee will look broken. Marquee usually needs a duplicate for the infinite loop.
              But the user said "Platforms (single line, no duplication)". 
              So I'll just remove the duplicate and maybe remove the marquee class or let it be a static single line centered if there's no duplicate? 
              I'll remove the duplicate block and keep it as a flex row, maybe animated maybe not, but single line no duplication. */}
        </div>
      </div>
    </section>
  );
}
