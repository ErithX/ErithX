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
  title: 'ErithX | Turn Career Prep Into a Game You Love to Win',
  description: 'ErithX connects your LeetCode, Codeforces, and GitHub activity and gives you an honest weekly review plus a focused plan. Track coding contests with 1‑click Google Calendar sync and prepare for tech roles with intent.',
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ErithX',
    url: process.env.NEXT_PUBLIC_NEW_DOMAIN,
    applicationCategory: 'EducationalApplication, DeveloperApplication',
    operatingSystem: 'All',
    description: 'The premier zero-noise digital sanctuary for software engineering students. Features 1-Click Google Calendar sync for coding contests, project blueprints with PDFs, and 2026+ practical career readiness.',
    featureList: [
      '1-Click Google Calendar & iCal Contest Sync with Timezone Auto-Conversion',
      'Multi-Platform Coding Contest Tracker (LeetCode, Codeforces, CodeChef, AtCoder, HackerRank, GeeksforGeeks)',
      '2026+ Practical Career Readiness & System Architecture Guides',
      'Project Blueprints with Downloadable PDFs',
      'Automated Contest Email Reminder Alerts & Weekly Digest',
      'Zero-Noise Burnout-Free Placement Preparation Hub'
    ],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };
  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-emerald-500/30 selection:text-white">
      {/* Prefetch resources and contests API data so it's instantly available when navigating */}
      <link rel="preload" href="/api/resources" as="fetch" crossOrigin="anonymous" />
      <link rel="preload" href="/api/contests" as="fetch" crossOrigin="anonymous" />
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
          {/* <Journey /> */}
          <Stats />
          <Testimonials />
          <CTA />
        </main>
      </ScrollRevealProvider>
    </div>
  );
}
