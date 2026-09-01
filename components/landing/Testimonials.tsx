'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { MessageSquareQuote } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Motion system — identical curve/duration/stagger to Features'       */
/* Reveal. Hoist these + Features' Reveal into @/components/Reveal.tsx */
/* on the consolidation pass; this file then just imports them.        */
/* ------------------------------------------------------------------ */
const EASE = 'cubic-bezier(0.16,1,0.3,1)';

function useInView(threshold = 0.25) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function useReduceMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);
  return reduce;
}

const rise = (inView: boolean, delay: number, reduce: boolean): React.CSSProperties =>
  reduce
    ? {}
    : {
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(48px)',
        transition: `opacity 800ms ${EASE} ${delay}ms, transform 800ms ${EASE} ${delay}ms`,
      };

/* The site hairline — draws under the evidence phrase once the quote lands */
const Mark: React.FC<{ active: boolean; delay: number; reduce: boolean; children: React.ReactNode }> = ({
  active, delay, reduce, children,
}) => (
  <span className="relative whitespace-nowrap">
    <span className="text-zinc-200">{children}</span>
    <span
      aria-hidden
      className="absolute inset-x-0 bottom-[0.05em] h-[2px] origin-left rounded-full bg-amber-400/70"
      style={
        reduce
          ? undefined
          : { transform: active ? 'scaleX(1)' : 'scaleX(0)', transition: `transform 900ms ${EASE} ${delay}ms` }
      }
    />
  </span>
);

/* ------------------------------ content ------------------------------ */

const SUPPORTING: { parts: [string, string, string]; name: string; meta: string; img: string }[] = [
  {
    parts: [
      'I used to open 30 tabs every morning trying to track contests and my progress. ErithX replaced all of them. The weekly review showed me I was ',
      'padding easy problems',
      ', and the milestone cards actually got me a recruiter DM on LinkedIn.',
    ],
    name: 'Arjun Mehta',
    meta: 'III Year, NIT Trichy',
    img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=150&q=80',
  },
  {
    parts: [
      'Every other platform feels like it’s built for some imaginary student. This one feels made for real students. The honest weekly feedback, the focus on real progress, and the no-guilt approach finally ',
      'made consistency feel possible',
      '.',
    ],
    name: 'Sneha Reddy',
    meta: 'II Year, BITS Pilani',
    img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=150&q=80',
  },
];

/* --------------------------- sub-components --------------------------- */

function Featured({ reduce }: { reduce: boolean }) {
  const { ref, inView } = useInView(0.3);

  return (
    <figure ref={ref} className="group lg:pr-12" style={rise(inView, 0, reduce)}>
      {/* mono texture — the one claim that most needs verifying gets verified */}
      <p className="mb-7 flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
        </span>
        Verified · SDE @ Google
      </p>

      <blockquote>
        <p className="text-2xl font-medium leading-[1.25] tracking-tight text-white md:text-3xl">
          Cracked Google SDE this year.
        </p>
        <p className="mt-5 text-base leading-relaxed text-zinc-400 md:text-lg">
          The interview experience articles from actual SDEs were helpful. The weekly reports{' '}
          <Mark active={inView} delay={700} reduce={reduce}>kept me consistent</Mark>{' '}
          without making me feel guilty on off-days.
        </p>
      </blockquote>

      <figcaption className="mt-9 flex items-center gap-4 border-t border-white/[0.06] pt-6">
        <Image
          unoptimized
          src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=150&q=80"
          width={88}
          height={88}
          alt="Vikram Singh"
          className="h-11 w-11 rounded-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
        />
        <div>
          <div className="text-sm font-medium text-zinc-100 transition-colors duration-300 group-hover:text-white">Vikram Singh</div>
          <div className="mt-0.5 text-xs text-zinc-500">IV Year, DTU</div>
        </div>
      </figcaption>
    </figure>
  );
}

function Entry({ data, reduce }: { data: (typeof SUPPORTING)[number]; reduce: boolean }) {
  const { ref, inView } = useInView(0.35);

  return (
    <figure ref={ref} className="group py-10 first:pt-0 last:pb-0" style={rise(inView, 0, reduce)}>
      <blockquote>
        <p className="text-[15px] leading-[1.85] text-zinc-400 transition-colors duration-300 group-hover:text-zinc-300">
          {data.parts[0]}
          <Mark active={inView} delay={550} reduce={reduce}>{data.parts[1]}</Mark>
          {data.parts[2]}
        </p>
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3.5">
        <Image
          unoptimized
          src={data.img}
          width={72}
          height={72}
          alt={data.name}
          className="h-9 w-9 rounded-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
        />
        <div>
          <div className="text-[13px] font-medium text-zinc-100 transition-colors duration-300 group-hover:text-white">{data.name}</div>
          <div className="mt-0.5 text-[11px] text-zinc-500">{data.meta}</div>
        </div>
      </figcaption>
    </figure>
  );
}

/* ------------------------------ section ------------------------------ */

export default function Testimonials() {
  const reduce = useReduceMotion();
  const { ref: headRef, inView: headIn } = useInView(0.4);

  return (
    <section id="community" className="relative overflow-hidden px-6 py-24 lg:py-28">
      {/* atmosphere stays emerald — spine rule, even in the amber section */}
      <div
        className="pointer-events-none absolute left-[6%] top-1/3 h-[480px] w-[480px] rounded-full opacity-[0.045]"
        style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)', filter: 'blur(90px)' }}
      />

      <div className="relative mx-auto max-w-6xl">

        {/* header — left editorial, assertion/whisper device */}
        <div ref={headRef} className="mb-16 max-w-2xl lg:mb-20">
          <div style={rise(headIn, 0, reduce)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <MessageSquareQuote className="h-3.5 w-3.5" />
              Student Voices
            </span>
          </div>

          <h2
            className="mt-6 text-5xl font-medium leading-[1.02] tracking-tighter text-white md:text-6xl"
            style={rise(headIn, 100, reduce)}
          >
            Their words,
            <br />
            <span className="text-zinc-600">not ours.</span>
          </h2>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-zinc-500" style={rise(headIn, 200, reduce)}>
            Real stories from students who stopped random grinding and started tracking real progress.
          </p>
        </div>

        {/* quotes — asymmetric editorial split; a column rule replaces the cards */}
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-0">
          <div className="lg:col-span-7">
            <Featured reduce={reduce} />
          </div>

          <div className="border-t border-white/[0.07] pt-12 lg:col-span-5 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <div className="divide-y divide-white/[0.07]">
              {SUPPORTING.map((t) => (
                <Entry key={t.name} data={t} reduce={reduce} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}