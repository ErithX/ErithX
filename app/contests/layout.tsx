import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Coding Contests Calendar',
  description: 'See all upcoming coding contests from LeetCode, Codeforces, CodeChef, and HackerRank in one simple calendar.',
};

export default function ContestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
