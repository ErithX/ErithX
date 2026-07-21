import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover Verified Tech Resources',
  description: 'Get free computer science notes, past year university question papers (PYQs), and simple guides for interview preparation.',
  keywords: 'Engineering education resource hub, Software engineering study materials library, Computer science learning feed, All in one tech education platform, Full stack developer learning directory, Tech roadmaps and study notes hub, BTech CSE complete resource library, Free engineering PDF notes download, Tech career guidance and roadmaps feed, Computer science university PYQ database, Latest tech blogs and trends 2026, System design and coding study materials, UI UX and backend developer resources, Download engineering semester notes, Browse computer science study materials, AI era software engineering roadmaps, Self taught developer resource archive, Engineering semester exam suggestions repository, Step by step tech career roadmaps, Curated data structures and algorithms notes, AI tools and frameworks learning hub, Engineering previous year question papers collection',
  openGraph: {
    title: 'Discover Verified Tech Resources | DSA Quest',
    description: 'Get free computer science notes, past year university question papers (PYQs), and simple guides for interview preparation.',
    url: 'https://dsaquest.in/resources',
    type: 'website',
  },
  alternates: {
    canonical: 'https://dsaquest.in/resources',
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
