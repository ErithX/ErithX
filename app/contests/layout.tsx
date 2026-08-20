import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Coding Contests Calendar & Competitive Programming Tracker',
  description: 'Track upcoming coding contests from LeetCode, Codeforces & more in real-time. Features 1-click Calendar sync (Google/Apple) to never miss a contest.',
  keywords: 'DSA contest today, dsa contest online, dsa contest platform, codechef dsa contest, dsa contest gfg, dsa coding contest, dsa contest tracker online, coding contest tracker, competitive programming calendar, hackathon calendar, add to calendar contest, google calendar coding contests',
  openGraph: {
    title: 'Live Coding Contests Calendar & Competitive Programming Tracker | ErithX',
    description: 'Track coding contests from LeetCode, Codeforces & more in real-time. Sync directly to your Google or Apple Calendar with 1-click.',
    url: `${process.env.NEXT_PUBLIC_NEW_DOMAIN}/contests`,
    type: 'website',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_NEW_DOMAIN}/contests`,
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
    'url': `${process.env.NEXT_PUBLIC_NEW_DOMAIN}/contests`,
    'publisher': {
      '@type': 'Organization',
      'name': 'ErithX',
      'url': process.env.NEXT_PUBLIC_NEW_DOMAIN,
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
