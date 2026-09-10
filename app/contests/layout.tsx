import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Coding Contest Calendar – LeetCode, Codeforces, CodeChef | ErithX',
  },
  description: 'Track upcoming coding contests from LeetCode, Codeforces, CodeChef, AtCoder and more in real-time. Features 1-click Calendar sync (Google/Apple) to never miss a contest.',
  keywords: 'DSA contest today, dsa contest online, dsa contest platform, codechef dsa contest, dsa contest gfg, dsa coding contest, dsa contest tracker online, coding contest tracker, competitive programming calendar, hackathon calendar, add to calendar contest, google calendar coding contests',
  openGraph: {
    title: 'Coding Contest Calendar – LeetCode, Codeforces, CodeChef | ErithX',
    description: 'Track coding contests from LeetCode, Codeforces & more in real-time. Sync directly to your Google or Apple Calendar with 1-click.',
    url: 'https://erithx.dev/contests',
    type: 'website',
    images: [
      {
        url: 'https://erithx.dev/landing/live-contests-dashboard.png',
        width: 1024,
        height: 594,
        alt: 'Coding Contest Calendar – LeetCode, Codeforces, CodeChef | ErithX',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coding Contest Calendar – LeetCode, Codeforces, CodeChef | ErithX',
    description: 'Track coding contests from LeetCode, Codeforces & more in real-time with 1-click Google Calendar sync.',
    images: ['https://erithx.dev/landing/live-contests-dashboard.png'],
  },
  alternates: {
    canonical: 'https://erithx.dev/contests',
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
    'name': 'Coding Contest Calendar – LeetCode, Codeforces, CodeChef | ErithX',
    'description': 'Track upcoming coding contests from LeetCode, Codeforces & more in real-time. Features 1-click Calendar sync (Google/Apple) to never miss a contest.',
    'url': 'https://erithx.dev/contests',
    'publisher': {
      '@type': 'Organization',
      'name': 'ErithX',
      'url': 'https://erithx.dev',
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
