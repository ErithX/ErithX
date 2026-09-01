import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy – ErithX',
  description: 'How ErithX collects, uses, and protects your data, including connected profiles from LeetCode, Codeforces, GitHub, and other platforms.',
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
