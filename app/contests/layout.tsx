import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Coding Contests Calendar & Competitive Programming Tracker',
  description: 'Track upcoming coding contests from LeetCode, Codeforces, CodeChef, AtCoder, and HackerRank in real-time. Free email alerts & contest schedule for tech interviews.',
  keywords: 'DSA contest today, dsa contest online, dsa contest platform, codechef dsa contest, dsa contest gfg, dsa coding contest, dsa contest tracker online, coding contest tracker, competitive programming calendar, hackathon calendar',
  openGraph: {
    title: 'Live Coding Contests Calendar & Competitive Programming Tracker | DSA Quest',
    description: 'Track upcoming coding contests from LeetCode, Codeforces, CodeChef, AtCoder, and HackerRank in real-time. Free email alerts & contest schedule.',
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
    'description': 'Track upcoming coding contests from LeetCode, Codeforces, CodeChef, AtCoder, and HackerRank in real-time.',
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
