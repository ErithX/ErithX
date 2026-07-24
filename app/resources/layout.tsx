import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '2026 SDE Resources That Actually Get You Hired',
  description: 'Skip generic CS notes. Master what gets you hired in 2026: modern System Design, advanced backend architectures, and the real truth about DSA in the AI era.',
  keywords: 'Engineering education resource hub, Software engineering study materials library, Computer science learning feed, All in one tech education platform, Full stack developer learning directory, High-intent tech career roadmaps, Next-gen AI developer preparation, AI era software engineering roadmaps, Tech career guidance and roadmaps feed, Generative AI coding strategies, Latest tech blogs and trends 2026, System design and coding study materials, UI UX and backend developer resources, Modern developer learning curves, Browse computer science study materials, AI-focused tech interview preparation, Self taught developer resource archive, Trending software architecture resources, Step by step tech career roadmaps, Curated data structures and algorithms notes, AI tools and frameworks learning hub',
  openGraph: {
    title: '2026 SDE Resources That Actually Get You Hired | DSA Quest',
    description: 'Skip generic CS notes. Master what gets you hired in 2026: modern System Design, advanced backend architectures, and the real truth about DSA in the AI era.',
    url: 'https://contest-tracker-zms3.vercel.app/resources',
    type: 'website',
  },
  alternates: {
    canonical: 'https://contest-tracker-zms3.vercel.app/resources',
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
