import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Coding Contests Calendar',
  description: 'See all upcoming coding contests from LeetCode, Codeforces, CodeChef, and HackerRank in one simple calendar.',
  keywords: 'DSA contest today, dsa contest online, dsa contest platform, codechef dsa contest, dsa contest gfg, dsa coding contest, dsa contest tracker online, coding contest tracker, coding competition',
};

export default function ContestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
