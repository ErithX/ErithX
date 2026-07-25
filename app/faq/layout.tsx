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
      {
        '@type': 'Question',
        name: 'Can I add contests to my personal calendar?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Every contest on our tracker comes with a 1-click \'Add to Calendar\' button. You can instantly sync any LeetCode, Codeforces, or CodeChef event directly to your Google Calendar, Apple Calendar, or Outlook so you never miss a start time.',
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
