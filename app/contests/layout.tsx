import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Coding Contests Calendar & Competitive Programming Tracker',
  description: 'Track upcoming coding contests from LeetCode, Codeforces & more in real-time. Features 1-click Calendar sync (Google/Apple) to never miss a contest.',
  keywords: 'DSA contest today, dsa contest online, dsa contest platform, codechef dsa contest, dsa contest gfg, dsa coding contest, dsa contest tracker online, coding contest tracker, competitive programming calendar, hackathon calendar, add to calendar contest, google calendar coding contests',
  openGraph: {
    title: 'Live Coding Contests Calendar & Competitive Programming Tracker | DSA Quest',
    description: 'Track coding contests from LeetCode, Codeforces & more in real-time. Sync directly to your Google or Apple Calendar with 1-click.',
    url: 'https://contest-tracker-zms3.vercel.app/contests',
    type: 'website',
  },
  alternates: {
    canonical: 'https://contest-tracker-zms3.vercel.app/contests',
  },
};

export default function ContestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Live Coding Contests Calendar & Competitive Programming Tracker',
    'description': 'Track upcoming coding contests from LeetCode, Codeforces & more in real-time. Features 1-click Calendar sync (Google/Apple) to never miss a contest.',
    'url': 'https://contest-tracker-zms3.vercel.app/contests',
    'publisher': {
      '@type': 'Organization',
      'name': 'DSA Quest',
      'url': 'https://contest-tracker-zms3.vercel.app',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
