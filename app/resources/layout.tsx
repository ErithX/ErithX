import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engineering Study Guides & System Architecture Blueprints',
  description: 'Curated technical resources on System Design, backend architectures, algorithm patterns, and real-world project blueprints for software engineering students.',
  keywords: 'Engineering education resource hub, Software engineering study materials library, Computer science learning feed, Full stack developer learning directory, System design and coding study materials, UI UX and backend developer resources, Curated data structures and algorithms notes',
  openGraph: {
    title: 'Engineering Study Guides & System Architecture Blueprints | ErithX',
    description: 'Curated technical resources on System Design, backend architectures, algorithm patterns, and real-world project blueprints for software engineering students.',
    url: `${process.env.NEXT_PUBLIC_NEW_DOMAIN || 'https://erithx.dev'}/resources`,
    type: 'website',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_NEW_DOMAIN || 'https://erithx.dev'}/resources`,
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
