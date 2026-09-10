import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/landing/Hero';
import PlatformMarquee from '@/components/landing/PlatformMarquee';
import Manifesto from '@/components/landing/Manifesto';
import Ecosystem from '@/components/landing/Ecosystem';
import Stats from '@/components/landing/Stats';
import Testimonials from '@/components/landing/Testimonials';
import CTA from '@/components/landing/CTA';
import ScrollRevealProvider from '@/components/landing/ScrollRevealProvider';
import ContestPrefetch from '@/components/landing/ContestPrefetch';

export const metadata: Metadata = {
  title: {
    absolute: 'ErithX — Coding Contests, 1-Click Calendar Sync & Weekly Performance Review',
  },
  description: 'ErithX connects your LeetCode, Codeforces, and GitHub activity and gives you an honest weekly review plus a focused plan. Track coding contests with 1‑click Google Calendar sync and prepare for tech roles with intent.',
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ErithX',
    url: process.env.NEXT_PUBLIC_NEW_DOMAIN || 'https://erithx.dev',
    applicationCategory: 'EducationalApplication, DeveloperApplication',
    operatingSystem: 'All',
    description: 'Competitive programming calendar and weekly habit analysis platform for developers. Features 1-Click Google Calendar sync for coding contests, LeetCode and Codeforces progress tracking, and engineering study resources.',
    featureList: [
      '1-Click Google Calendar & iCal Contest Sync with Timezone Auto-Conversion',
      'Multi-Platform Coding Contest Tracker (LeetCode, Codeforces, CodeChef, AtCoder, HackerRank, GeeksforGeeks)',
      'Automated Weekly Performance Reviews for LeetCode, Codeforces & GitHub',
      'Practical System Architecture & Engineering Study Guides',
      'Automated Contest Email Reminder Alerts'
    ],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };
  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-emerald-500/30 selection:text-white">
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
        <ContestPrefetch />
      </ScrollRevealProvider>
    </div>
  );
}
