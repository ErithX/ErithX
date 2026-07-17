import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
