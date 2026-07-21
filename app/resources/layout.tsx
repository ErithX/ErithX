import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover Verified Tech Resources',
  description: 'Get high-intent tech career roadmaps, modern AI-focused preparation strategies, and curated study materials to navigate the changing learning curve in the AI era.',
  keywords: 'Engineering education resource hub, Software engineering study materials library, Computer science learning feed, All in one tech education platform, Full stack developer learning directory, High-intent tech career roadmaps, Next-gen AI developer preparation, AI era software engineering roadmaps, Tech career guidance and roadmaps feed, Generative AI coding strategies, Latest tech blogs and trends 2026, System design and coding study materials, UI UX and backend developer resources, Modern developer learning curves, Browse computer science study materials, AI-focused tech interview preparation, Self taught developer resource archive, Trending software architecture resources, Step by step tech career roadmaps, Curated data structures and algorithms notes, AI tools and frameworks learning hub',
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
