import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DSA Study Materials and Notes Hub',
  description: 'Get free computer science notes, past year university question papers (PYQs), and simple guides for interview preparation.',
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
