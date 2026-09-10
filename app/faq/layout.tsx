import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers about ErithX, competitive programming contest tracking, 1-click Google Calendar sync, and automated weekly performance reviews.',
  alternates: {
    canonical: 'https://erithx.dev/faq',
  },
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
        name: 'What is ErithX?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ErithX is a modern self-improvement system for engineering students. It helps you track high-quality coding contests, access focused resources, and get honest weekly performance reviews based on your LeetCode, Codeforces, and GitHub activity.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is this platform free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all core features available now — including the contest tracker, resource hub, and weekly performance reviews — are completely free for students. Optional premium features may be added in the future.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I add contests to my personal calendar?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Every contest on our tracker comes with a 1-click "Add to Calendar" button. You can instantly sync LeetCode, Codeforces, CodeChef, and other events directly to your Google Calendar so you never miss a start time.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I connect my LeetCode, GitHub, or Codeforces accounts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Navigate to Dashboard → Settings → Coding Profiles. Paste your profile URL or username for LeetCode, GitHub, or Codeforces. The system will automatically verify and sync your profile without requiring passwords or manual logs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why should I connect my coding profiles?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Connecting your profiles powers your weekly performance review. The system monitors your contest activity, problem-solving patterns, and GitHub commits to generate honest feedback and a focused plan for the next 7 days — no manual progress logging needed.',
        },
      },
      {
        '@type': 'Question',
        name: 'What resources can I find here?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ErithX Resources is a curated collection of focused articles on career strategy, system design, and software engineering. It is designed to complement your weekly review.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I log in to the platform?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can sign up or log in using your existing Google account through our secure authentication. No need to remember another password — just one click and you are in.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do you use my email address?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We use your email to create your account, send contest alerts, and deliver your weekly performance review. We never sell or share your data with anyone else.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I request to delete my account and data?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'If you want to delete your account or remove your data from our system, send an email to hello@erithx.dev and we will process it as soon as possible.',
        },
      },
      {
        '@type': 'Question',
        name: 'What features are coming in the future?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The weekly performance review system is live in beta. Growth visualization cards, deeper analytics, and optional 1:1 mentorship sessions are planned for users who consistently follow their plans.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I report a bug or give feedback?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can reach out via hello@erithx.dev or connect with us through the social links on the Contact page. We are an independent project and actively use feedback to shape the roadmap.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does the weekly performance review work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Once your profiles are connected, the system studies your activity each week: consistency, problem mix, topic gaps, contest behavior, and project alignment. At the end of the week, you get a review with honest feedback and clear targets for the next 7 days.',
        },
      },
      {
        '@type': 'Question',
        name: 'What if I keep ignoring the system\'s targets?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The system expects you to take its suggestions seriously. If you ignore targets for 3–4 weeks in a row, your access to performance reviews may be suspended based on your past behavior.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the weekly review always correct?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The review system is live in beta. It is designed to study patterns and give useful direction, but treat it as a strong signal rather than absolute truth.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use ErithX if I\'m a beginner or already advanced?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. For beginners, the system focuses on building consistency and problem-solving habits. For advanced developers, it analyzes topic gaps, contest strategy, and project alignment.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you provide courses or video tutorials?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. ErithX is not a course platform. It is a weekly review and planning system with focused articles designed to guide your self-directed work.',
        },
      },
      {
        '@type': 'Question',
        name: 'What platforms do you support for contests?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We track contests across LeetCode, Codeforces, CodeChef, AtCoder, HackerRank, and GeeksforGeeks with direct links and 1-click calendar sync.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I contact support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For any issues, questions, or feedback, email us at hello@erithx.dev.',
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
