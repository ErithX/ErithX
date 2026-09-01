"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";

// Exact text
const textPart1 = "We looked at your recent activity. The pattern is clear: you’re mostly doing what’s already comfortable and skipping the hard stuff. We found exactly where you’re holding back.";
const textPart2 = "See what your target for next week is.";

const blurredText = "You are actively avoiding Graph traversals. Next week: 5 Medium DP problems & 2 non-tutorial feature commits.";

// Track bold words
const visibleWords = [
  ...textPart1.split(" ").map(w => ({ text: w, bold: false })),
  ...textPart2.split(" ").map(w => ({ text: w, bold: true }))
];
const blurredWords = blurredText.split(" ");

interface HeroConstellationProps {
  inView?: boolean;
  reduce?: boolean;
}

export default function HeroConstellation({ inView = true, reduce = false }: HeroConstellationProps) {
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    if (!inView || reduce) return;

    if (activeWordIndex < visibleWords.length) {
      const timer = setTimeout(() => setActiveWordIndex((p) => p + 1), 180);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowCTA(true), 800);
      return () => clearTimeout(timer);
    }
  }, [activeWordIndex, inView, reduce]);

  if (reduce) {
    return (
      <div className="w-full max-w-[950px] h-[550px] bg-[#030303] rounded-2xl border border-white/10 p-8 flex flex-col justify-center">
         <p className="text-xl font-medium text-zinc-300">
           {textPart1} <span className="font-bold text-white">{textPart2}</span>
         </p>
         <p className="mt-4 text-lg text-zinc-500 blur-sm">{blurredText}</p>
      </div>
    );
  }

  return (
    // 1. RESPONSIVE CONTAINER (Adjusted for mobile scale)
    <div className="relative w-full max-w-[950px] min-h-[300px] md:min-h-0 h-[300px] md:h-[600px] flex items-center justify-center p-0 sm:p-4 font-sans antialiased mt-2 md:mt-0">
      
      {/* =========================================
          SCATTERED & COLORFUL ICONS 
          Removed grayscale, heavily staggered posi      {/* 1. Gmail (High & Inward) */}
      <motion.div animate={{ y: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        className="absolute top-[2%] md:top-[5%] left-[80%] md:left-[18%] w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#0a0a0a] border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.8)] z-40 flex items-center justify-center overflow-hidden p-1.5 md:p-2.5 cursor-default">
        <Image src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" alt="Gmail" width={24} height={24} 
          className="object-contain drop-shadow-md" />
      </motion.div>

      {/* 2. GitHub (Mid-High & Outward) */}
      <motion.div animate={{ y: [4, -4, 4] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute top-[12%] md:top-[28%] left-[5%] md:left-[-2%] w-9 h-9 md:w-14 md:h-14 rounded-full bg-[#0a0a0a] border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.8)] z-40 flex items-center justify-center overflow-hidden p-2 md:p-3 cursor-default">
        <Image src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width={28} height={28} 
          className="object-contain invert opacity-90 drop-shadow-md" />
      </motion.div>

      {/* 3. Codeforces (Center & Inward) */}
      <motion.div animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
        className="absolute top-[45%] md:top-[50%] left-[88%] md:left-[-15%] w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#0a0a0a] border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.8)] z-40 flex items-center justify-center overflow-hidden p-1.5 md:p-2 cursor-default">
        <Image src="https://cdn.iconscout.com/icon/free/png-256/free-code-forces-3628695-3029920.png" alt="Codeforces" width={26} height={26} 
          className="object-contain drop-shadow-md" />
      </motion.div>

      {/* 4. LeetCode (Mid-Low & Outward) */}
      <motion.div animate={{ y: [3, -3, 3] }} transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
        className="absolute bottom-[10%] md:bottom-[20%] left-[8%] md:left-[2%] w-7 h-7 md:w-11 md:h-11 rounded-full bg-[#0a0a0a] border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.8)] z-40 flex items-center justify-center overflow-hidden p-1.5 md:p-2 cursor-default">
        <Image src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" alt="LeetCode" width={22} height={22} 
          className="object-contain drop-shadow-md" />
      </motion.div>

      {/* 5. Google Calendar (Bottom & Very Inward) */}
      <motion.div animate={{ y: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
        className="absolute bottom-[2%] md:bottom-[2%] left-[80%] md:left-[22%] w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#0a0a0a] border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.8)] z-40 flex items-center justify-center overflow-hidden p-1.5 md:p-2.5 cursor-default">
        <Image src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Calendar" width={24} height={24} 
          className="object-contain drop-shadow-md" />
      </motion.div>


      {/* =========================================
          CONNECTING SVG DATA LINES (Desktop - Original Layout)
          ========================================= */}
      <svg viewBox="0 0 950 600" className="hidden md:block absolute inset-0 w-full h-full z-10 pointer-events-none" style={{ filter: 'drop-shadow(0px 0px 6px rgba(244,63,94,0.35))' }}>
        <motion.path d="M 170,55 C 200,80 200,160 260,170" fill="transparent" stroke="url(#line-grad)" strokeWidth="1.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: 1.5 }} />
        
        <motion.path d="M 10,190 C 80,195 120,210 240,230" fill="transparent" stroke="url(#line-grad)" strokeWidth="1.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: 1.5, delay: 0.2 }} />
        
        <motion.path d="M 110,330 C 180,330 200,290 260,300" fill="transparent" stroke="url(#line-grad)" strokeWidth="1.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: 1.5, delay: 0.4 }} />
        
        <motion.path d="M 30,470 C 100,470 140,380 240,360" fill="transparent" stroke="url(#line-grad)" strokeWidth="1.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: 1.5, delay: 0.6 }} />

        <motion.path d="M 200,570 C 260,550 240,440 280,410" fill="transparent" stroke="url(#line-grad)" strokeWidth="1.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: 1.5, delay: 0.8 }} />

        <defs>
          <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>

      {/* =========================================
          CONNECTING SVG DATA LINES (Mobile - Distributed Layout)
          ========================================= */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="block md:hidden absolute inset-0 w-full h-full z-10 pointer-events-none" style={{ filter: 'drop-shadow(0px 0px 6px rgba(244,63,94,0.35))' }}>
        {/* Gmail (Top Right) -> Card */}
        <motion.path d="M 80,10 C 70,20 60,30 55,35" fill="transparent" stroke="url(#line-grad-mob)" strokeWidth="0.5" vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: 1.5 }} />
        
        {/* GitHub (Top Left) -> Card */}
        <motion.path d="M 12,18 C 25,25 35,30 40,35" fill="transparent" stroke="url(#line-grad-mob)" strokeWidth="0.5" vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: 1.5, delay: 0.2 }} />
        
        {/* Codeforces (Right Mid) -> Card */}
        <motion.path d="M 92,45 C 80,45 70,40 55,40" fill="transparent" stroke="url(#line-grad-mob)" strokeWidth="0.5" vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: 1.5, delay: 0.4 }} />
        
        {/* LeetCode (Bottom Left) -> Card */}
        <motion.path d="M 14,83 C 25,75 35,65 40,55" fill="transparent" stroke="url(#line-grad-mob)" strokeWidth="0.5" vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: 1.5, delay: 0.6 }} />

        {/* Calendar (Bottom Right) -> Card */}
        <motion.path d="M 78,92 C 70,80 60,70 55,55" fill="transparent" stroke="url(#line-grad-mob)" strokeWidth="0.5" vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: 1.5, delay: 0.8 }} />

        <defs>
          <linearGradient id="line-grad-mob" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>


      {/* =========================================
          THE MAIN ANALYSIS CARD 
          Responsive height and font sizes for mobile
          ========================================= */}
      <motion.div
        initial={{ opacity: 0, x: 30 }} animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 30 }} transition={{ duration: 0.8 }}
        className="relative mt-4 md:mt-20 mx-auto md:ml-auto right-0 w-[95%] md:w-[88%] h-[200px] md:h-[400px] bg-[#030303] rounded-2xl p-4 md:p-10 z-30 overflow-hidden shadow-2xl border border-white/[0.04]"
      >
        {/* Subtle Top-Left Glow Border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500 via-rose-500/20 to-transparent" />
        <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-gradient-to-b from-rose-500 via-rose-500/20 to-transparent" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-rose-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6 relative z-10">
          <div className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-pulse" />
          <p className="text-[10px] md:text-[12px] font-mono font-semibold text-zinc-400 tracking-widest uppercase">Live Analysis</p>
        </div>

        <div className="relative h-full z-10">
          {/* Scanning Text Container */}
          <div className="flex flex-wrap items-center gap-x-[0.25rem] md:gap-x-[0.4rem] gap-y-[0.25rem] md:gap-y-[0.4rem] text-[12px] md:text-[21px] leading-[1.5] md:leading-[1.65] tracking-tight">
            
            <AnimatePresence mode="popLayout">
              {visibleWords.map((wordObj, i) => {
                const isActive = i === activeWordIndex;
                const isFuture = i > activeWordIndex;
                if (isFuture) return null;

                const restingColor = wordObj.bold ? "#ffffff" : "#a1a1aa";
                const restingWeight = wordObj.bold ? "font-bold" : "font-medium";

                return (
                  <motion.span 
                    key={`vis-${i}`} 
                    initial={{ opacity: 0, scale: 0.8, y: 10 }} 
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: isActive ? 1.35 : 1, 
                      color: isActive ? "#ffffff" : restingColor, 
                      filter: isActive ? "drop-shadow(0px 0px 8px rgba(255,255,255,0.4))" : (wordObj.bold ? "drop-shadow(0px 0px 4px rgba(255,255,255,0.1))" : "drop-shadow(0px 0px 0px rgba(0,0,0,0))")
                    }} 
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className={`inline-block origin-left ${restingWeight} ${isActive ? 'z-10' : 'z-0'}`}
                  >
                    {wordObj.text}
                  </motion.span>
                );
              })}

              {activeWordIndex < visibleWords.length && (
                <motion.span 
                  key="cursor"
                  animate={{ opacity: [1, 0.2] }} 
                  transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut" }} 
                  className="inline-block w-[10px] h-[1.2em] bg-rose-500 rounded-[2px] ml-1 align-middle shadow-[0_0_12px_rgba(244,63,94,0.6)]" 
                />
              )}
            </AnimatePresence>

            {/* Blurred Reveal Text */}
            {activeWordIndex >= visibleWords.length && (
              <motion.div 
                initial={{ opacity: 0, filter: "blur(10px)" }} 
                animate={{ opacity: 1, filter: "blur(5px)" }} 
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="mt-4 text-zinc-500 font-medium select-none pointer-events-none w-full"
              >
                {blurredWords.map((word, i) => <span key={`blur-${i}`} className="inline-block mr-1.5">{word}</span>)}
              </motion.div>
            )}
          </div>

          {/* CTA Overlay (Aesthetic Glassmorphic Dark Button) */}
          {showCTA && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-4 left-0 right-0 flex justify-center z-40"
            >
              <div className="absolute -inset-16 bg-gradient-to-t from-[#030303] via-[#030303]/95 to-transparent pointer-events-none" />
              
              <button className="relative flex items-center gap-2 px-5 md:px-8 py-2 md:py-3.5 rounded-full text-[12px] md:text-[15px] font-semibold text-zinc-100 bg-zinc-950/60 backdrop-blur-md border border-rose-500/30 hover:border-rose-500/70 shadow-[0_0_20px_rgba(244,63,94,0.15)] hover:shadow-[0_0_35px_rgba(244,63,94,0.35)] transition-all duration-300 group overflow-hidden">
                {/* Internal button hover glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <Lock size={16} className="text-rose-500 relative z-10 w-3 h-3 md:w-4 md:h-4" />
                <span className="relative z-10">Reveal your honest report</span>
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}