"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

interface PlatformDropdownProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export default function PlatformDropdown({
  isOpen,
  onOpen,
  onClose,
  onToggle,
  dropdownRef
}: PlatformDropdownProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    onOpen();
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      onClose();
    }, 200); // 200ms grace period so mouse transition into fixed panel is 100% smooth
  };

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium transition-all rounded-lg ${
          isOpen ? 'text-white bg-white/10' : 'text-zinc-300 hover:text-white hover:bg-white/5'
        }`}
        aria-expanded={isOpen}
      >
        <span>Platform</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-400' : 'text-zinc-400'}`} />
      </button>

      {/* Full-Width Glassmorphic Flyout Dropdown (Solid Dark Opacity for Pure Readability) */}
      {isOpen && (
        <div 
          className="fixed left-0 top-16 w-full bg-[#09090b]/95 border-b border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.85)] z-50 backdrop-blur-2xl animate-in fade-in slide-in-from-top-1 duration-150"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="grid grid-cols-3 gap-8 items-start">
              
              {/* Column 1: Core Capabilities */}
              <div className="space-y-3">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 pb-1.5 border-b border-white/5">
                  Core Capabilities
                </div>

                <div className="grid gap-1">
                  <Link 
                    href="/contests" 
                    onClick={onClose}
                    className="group p-2.5 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/10 transition-all block"
                  >
                    <div className="flex items-center justify-between text-sm font-semibold text-zinc-100 group-hover:text-white">
                      <span>Live Contest Board</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 opacity-60 group-hover:opacity-100" />
                    </div>
                    <p className="text-xs text-zinc-400 group-hover:text-zinc-300 mt-0.5">
                      Multi-platform contest aggregator & match tracker.
                    </p>
                  </Link>

                  <Link 
                    href="/resources" 
                    onClick={onClose}
                    className="group p-2.5 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/10 transition-all block"
                  >
                    <div className="flex items-center justify-between text-sm font-semibold text-zinc-100 group-hover:text-white">
                      <span>Placement Blueprints</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 opacity-60 group-hover:opacity-100" />
                    </div>
                    <p className="text-xs text-zinc-400 group-hover:text-zinc-300 mt-0.5">
                      System design roadmaps & downloadable PDF guides.
                    </p>
                  </Link>
                </div>
              </div>

              {/* Column 2: Ecosystem */}
              <div className="space-y-3 border-l border-white/5 pl-8">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 pb-1.5 border-b border-white/5">
                  Ecosystem
                </div>

                <div className="grid gap-1">
                  <Link 
                    href="/features" 
                    onClick={onClose}
                    className="group p-2.5 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/10 transition-all block"
                  >
                    <div className="flex items-center justify-between text-sm font-semibold text-zinc-100 group-hover:text-white">
                      <span>Capabilities Showcase</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 opacity-60 group-hover:opacity-100" />
                    </div>
                    <p className="text-xs text-zinc-400 group-hover:text-zinc-300 mt-0.5">
                      Visual specs, scraper engine & feature matrix.
                    </p>
                  </Link>

                  <Link 
                    href="/docs" 
                    onClick={onClose}
                    className="group p-2.5 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/10 transition-all block"
                  >
                    <div className="flex items-center justify-between text-sm font-semibold text-zinc-100 group-hover:text-white">
                      <span>Documentation</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 opacity-60 group-hover:opacity-100" />
                    </div>
                    <p className="text-xs text-zinc-400 group-hover:text-zinc-300 mt-0.5">
                      Developer manuals, API reference & calendar setup.
                    </p>
                  </Link>
                </div>
              </div>

              {/* Column 3: Support & Company */}
              <div className="space-y-3 border-l border-white/5 pl-8">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 pb-1.5 border-b border-white/5">
                  Support & Company
                </div>

                <div className="grid gap-1">
                  <Link 
                    href="/about" 
                    onClick={onClose}
                    className="group p-2.5 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/10 transition-all block"
                  >
                    <div className="flex items-center justify-between text-sm font-semibold text-zinc-100 group-hover:text-white">
                      <span>About Us</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 opacity-60 group-hover:opacity-100" />
                    </div>
                    <p className="text-xs text-zinc-400 group-hover:text-zinc-300 mt-0.5">
                      Our mission & engineering manifesto.
                    </p>
                  </Link>

                  <Link 
                    href="/contact" 
                    onClick={onClose}
                    className="group p-2.5 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/10 transition-all block"
                  >
                    <div className="flex items-center justify-between text-sm font-semibold text-zinc-100 group-hover:text-white">
                      <span>Support & Contact</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 opacity-60 group-hover:opacity-100" />
                    </div>
                    <p className="text-xs text-zinc-400 group-hover:text-zinc-300 mt-0.5">
                      Direct developer communication channel.
                    </p>
                  </Link>

                  <Link 
                    href="/faq" 
                    onClick={onClose}
                    className="group p-2.5 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/10 transition-all block"
                  >
                    <div className="flex items-center justify-between text-sm font-semibold text-zinc-100 group-hover:text-white">
                      <span>Frequently Asked Questions</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 opacity-60 group-hover:opacity-100" />
                    </div>
                    <p className="text-xs text-zinc-400 group-hover:text-zinc-300 mt-0.5">
                      Common questions about contest tracking.
                    </p>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
