import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is DSA Quest?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'DSA Quest is an all-in-one platform for students to track upcoming coding contests and access high-quality DSA study materials.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is DSA Quest free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, tracking coding contests and accessing community study resources is completely free for all students.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
