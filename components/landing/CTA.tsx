'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Instrument_Serif } from 'next/font/google';
import AuthCTAButton from './AuthCTAButton';

/* The one special-word font on the site — same “era” as the hero.
   Better: hoist this into lib/fonts.ts and share it with Hero. */
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['italic'], display: 'swap' });

const TRUST = ['No spam, ever', 'Unsubscribe anytime', 'Built by a solo dev grinding SDE interviews'];

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const magRef = useRef<HTMLDivElement>(null);

  const [inView, setInView] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [week, setWeek] = useState<number | null>(null);
  const [firstReview, setFirstReview] = useState('');
  const [count, setCount] = useState(0);

  /* ---- observe once ---- */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    if (mq.matches) { setCount(400); setInView(true); }

    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ---- live data: real week number + the date the first review lands ---- */
  useEffect(() => {
    const now = new Date();
    const t = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const dow = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - dow);
    const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    setWeek(Math.ceil(((t.getTime() - y0.getTime()) / 86400000 + 1) / 7));

    const d = new Date(now);
    const add = (7 - d.getDay()) % 7; // days until Sunday
    d.setDate(d.getDate() + add);
    setFirstReview(
      add === 0
        ? 'today'
        : new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(d),
    );
  }, []);

  /* ---- count-up on the social proof, once in view ---- */
  useEffect(() => {
    if (!inView || reduce) return;
    const start = performance.now(), dur = 1200;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 400));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce]);

  /* ---- cursor dusk: one blurred-free radial, lerped in rAF, zero re-renders ---- */
  useEffect(() => {
    if (reduce) return;
    const sec = sectionRef.current, spot = spotRef.current;
    if (!sec || !spot) return;
    let raf = 0, tx = 0, ty = 0, ax = 0, ay = 0;
    const onMove = (e: MouseEvent) => {
      const r = sec.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top;
    };
    const onEnter = () => { spot.style.opacity = '1'; };
    const onLeave = () => { spot.style.opacity = '0'; };
    const loop = () => {
      ax += (tx - ax) * 0.07; ay += (ty - ay) * 0.07;
      spot.style.transform = `translate3d(${ax - 320}px, ${ay - 320}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    sec.addEventListener('mousemove', onMove);
    sec.addEventListener('mouseenter', onEnter);
    sec.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      sec.removeEventListener('mousemove', onMove);
      sec.removeEventListener('mouseenter', onEnter);
      sec.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  /* ---- magnetic button ---- */
  const onMagMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = magRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const clamp = (v: number) => Math.max(-6, Math.min(6, v));
    el.style.transition = 'transform .18s ease-out';
    el.style.transform = `translate(${clamp(dx * 0.22)}px, ${clamp(dy * 0.3)}px)`;
  };
  const onMagLeave = () => {
    const el = magRef.current; if (!el) return;
    el.style.transition = 'transform .55s cubic-bezier(.22,1,.36,1)';
    el.style.transform = 'translate(0,0)';
  };

  /* ---- reveal helpers ---- */
  const EASE = 'cubic-bezier(.22,1,.36,1)';
  const rise = (d: string): React.CSSProperties =>
    reduce ? {} : { transform: inView ? 'none' : 'translateY(110%)', transition: `transform .9s ${EASE} ${d}` };
  const fade = (d: string): React.CSSProperties =>
    reduce ? {} : { opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(14px)', transition: `opacity .8s ${EASE} ${d}, transform .8s ${EASE} ${d}` };
  const scaleX = (d: string): React.CSSProperties =>
    reduce ? {} : { transform: inView ? 'scaleX(1)' : 'scaleX(0)', transition: `transform 1.1s ${EASE} ${d}` };

  return (
    <section id="join" ref={sectionRef} className="relative overflow-hidden px-6 py-28">
      {/* ambient — yours, kept */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at bottom, rgba(6,78,59,0.2), #09090b 60%)' }} />
      <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)', filter: 'blur(80px)' }} />

      {/* cursor dusk */}
      <div
        ref={spotRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0 h-[640px] w-[640px] opacity-0 transition-opacity duration-700 will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08), transparent 65%)' }}
      />

      <div className="relative z-10 mx-auto max-w-2xl text-center">

        {/* live kicker — the same “Live · Week Nº” chip the hero opened with */}
        <p className="mb-8 flex items-center justify-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500" style={fade('0.05s')}>
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Live · {week !== null ? `Week Nº ${String(week).padStart(2, '0')}` : 'Syncing'}
        </p>

        {/* headline — “era” underlined; the period stays emerald, like the hero */}
        <h2 className="mb-7 text-[clamp(2.4rem,6vw,4.25rem)] font-medium leading-[1.05] tracking-tight text-white">
          <span className="block overflow-hidden pb-1">
            <span className="block" style={rise('0.15s')}>
              Start your{' '}
              <span className="relative inline-block">
                <span className={`text-[1.06em] italic text-emerald-400 ${serif.className}`}>weekly review</span>
                <span
                  className="absolute bottom-[0.08em] left-0 right-0 h-[2px] origin-left rounded-full bg-emerald-400/70 shadow-[0_0_14px_rgba(16,185,129,0.45)]"
                  style={scaleX('0.85s')}
                />
              </span>
            </span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span className="block" style={rise('0.28s')}>
              today<span className="text-emerald-400">.</span>
            </span>
          </span>
        </h2>

        <p className="mx-auto mb-10 max-w-md text-sm leading-relaxed text-zinc-400" style={fade('0.45s')}>
          Join{' '}
          <span className="font-medium tabular-nums text-zinc-100">
            <span aria-hidden>{count.toLocaleString('en-US')}+</span>
            <span className="sr-only">400+</span>
          </span>{' '}
          engineering students using ErithX to turn random grinding into focused progress. Free to
          start, with optional premium features coming soon.
        </p>

        {/* magnetic CTA — hover zone slightly larger than the button */}
        <div className="mb-4 inline-block p-1.5" style={fade('0.58s')}>
          <div ref={magRef} onMouseMove={onMagMove} onMouseLeave={onMagLeave}>
            <AuthCTAButton className="group inline-flex items-center gap-2.5 rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-zinc-950 shadow-[0_8px_30px_rgba(255,255,255,0.08)] transition-colors duration-300 hover:bg-emerald-400">
              Begin my ErithX review
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2} />
            </AuthCTAButton>
          </div>
        </div>

        {/* the CTA knows when your first review lands — real date, computed */}
        <p className="mb-10 text-xs text-zinc-500" style={fade('0.68s')}>
          Your first weekly review lands {firstReview || 'Sunday'}.
        </p>

        {/* trust row */}
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/[0.07] pt-7" style={fade('0.78s')}>
          {TRUST.map((t) => (
            <li key={t} className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-emerald-500/80" strokeWidth={2.5} />
              <span className="text-[11px] text-zinc-500">{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* the horizon — opens on reveal, then breathes */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40">
        <div
          className="absolute bottom-0 h-px w-full origin-center bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
          style={scaleX('0.4s')}
        />
        <div
          className={`absolute bottom-0 h-40 w-full ${reduce ? '' : 'c-breathe'}`}
          style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 100%, rgba(16,185,129,0.10), transparent 70%)' }}
        />
      </div>

      <style>{`
        @keyframes c-breathe { 0%,100% { opacity:.55 } 50% { opacity:1 } }
        .c-breathe { animation: c-breathe 7s ease-in-out infinite }
      `}</style>
    </section>
  );
}