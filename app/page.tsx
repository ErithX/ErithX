import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/landing/Hero';
import PlatformMarquee from '@/components/landing/PlatformMarquee';
import Manifesto from '@/components/landing/Manifesto';
import Ecosystem from '@/components/landing/Ecosystem';
import Journey from '@/components/landing/Journey';
import Stats from '@/components/landing/Stats';
import Testimonials from '@/components/landing/Testimonials';
import CTA from '@/components/landing/CTA';
import ScrollRevealProvider from '@/components/landing/ScrollRevealProvider';

export const metadata: Metadata = {
  title: 'DSA Quest | Turn Career Prep Into a Game You Love to Win',
  description: 'Make coding practice engaging. Track live contests from major platforms, get clear study notes, and prepare for your placement exams.',
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DSA Quest',
    url: 'https://contest-tracker-zms3.vercel.app',
    description: 'Track upcoming coding contests and find high-quality DSA study materials.',
  };
  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-emerald-500/30 selection:text-white">
      {/* Prefetch resources API data so it's instantly available when navigating to /resources */}
      <link rel="preload" href="/api/resources" as="fetch" crossOrigin="anonymous" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <ScrollRevealProvider>
        <main>
          <Hero />
          <PlatformMarquee />
          <Manifesto />
          <Ecosystem />
          <Journey />
          <Stats />
          <Testimonials />
          <CTA />
        </main>
      </ScrollRevealProvider>
    </div>
  );
}
