import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service – ErithX',
  description: 'Legal guidelines for using ErithX, an independent project built to help engineering students with contest alerts, weekly performance reviews, and career guidance resources.',
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
