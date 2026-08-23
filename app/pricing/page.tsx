import React from 'react';
import Navbar from '@/components/Navbar';
import PricingClient from './PricingClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | DSA Quest',
  description: 'Simple pricing for serious progress. Stop guessing. Get honest weekly feedback that actually pushes you forward.',
};

export default function PricingPage() {
  return (
    <div className="flex flex-col items-center bg-[#09090b] text-white overflow-x-hidden font-sans min-h-screen relative">
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="relative z-10 w-full max-w-5xl px-6 py-20 md:py-28 flex-grow">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
            Simple pricing for <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">serious progress</span>
          </h1>
          <p className="text-zinc-400 max-w-lg mx-auto">Stop guessing. Get honest weekly feedback that actually pushes you forward.</p>
        </header>

        <PricingClient />
      </main>
    </div>
  );
}
