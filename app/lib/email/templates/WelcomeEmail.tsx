import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Link,
  Button,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface WelcomeEmailProps {
  userName: string;
}

export const WelcomeEmail = ({ userName = 'Coder' }: WelcomeEmailProps) => {
  const previewText = `Welcome to ErithX — giving your coding era real direction.`;

  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style>{`
          :root {
            color-scheme: light dark;
            supported-color-schemes: light dark;
          }
          @media (prefers-color-scheme: dark) {
            .dark-bg { background-color: #0a0a0c !important; }
            .dark-card-bg { background-color: #121216 !important; }
            .dark-text-primary { color: #ffffff !important; }
            .dark-text-secondary { color: #a1a1aa !important; }
            .dark-text-muted { color: #71717a !important; }
            .dark-border { border-color: #27272a !important; }
            .dark-red-border { border-color: #ef4444 !important; }
          }
        `}</style>
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="my-auto mx-auto font-sans px-2 bg-white dark-bg" style={{ margin: 'auto', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
          <Container className="my-[32px] mx-auto p-[24px] max-w-[500px]">
            <Text className="text-[#18181b] dark-text-primary text-[15px] leading-[24px] mb-[12px]">
              Hey {userName},
            </Text>

            <Text className="text-[#3f3f46] dark-text-secondary text-[14px] leading-[23px] mb-[14px]">
              You just joined a space that's going to notice things about your prep that you might be quietly avoiding — and tell you, every week, whether you like it or not.
            </Text>

            <Text className="text-[#52525b] dark-text-secondary text-[14px] leading-[23px] mb-[20px]">
              That's the whole point of ErithX. Every Sunday at 9 PM, it looks at what you actually did across LeetCode, Codeforces, GitHub (and others), not what you meant to do, and writes you a real review: where you're solid, where you've been coasting, and what next week should look like.
            </Text>

            <Section className="border-l-[3px] border-solid border-[#ef4444] dark-red-border bg-[#fafafa] dark-card-bg border-t border-r border-b border-t-[#f4f4f5] border-r-[#f4f4f5] border-b-[#f4f4f5] rounded-r-lg px-[16px] py-[14px] my-[24px]">
              <Text className="text-[#09090b] dark-text-primary text-[14px] font-semibold m-0 mb-[4px]">
                1. Set your target & link profiles
              </Text>
              <Text className="text-[#52525b] dark-text-secondary text-[13px] leading-[19px] m-0 mb-[14px]">
                Head to <Link href="https://erithx.dev/dashboard/settings" className="text-[#ef4444] underline font-semibold">Settings</Link> to choose your career goal (FAANG, Startups, etc.) and link your active handles (LeetCode, GitHub, Codeforces). Takes 30 seconds.
              </Text>

              <Text className="text-[#09090b] dark-text-primary text-[14px] font-semibold m-0 mb-[4px]">
                2. Watch your inbox this Sunday at 9:00 PM
              </Text>
              <Text className="text-[#52525b] dark-text-secondary text-[13px] leading-[19px] m-0">
                Every Sunday evening, ErithX reviews your rhythm against your chosen target, flags where you're comfortable vs. what you're avoiding, and delivers your plan for the next 7 days.
              </Text>
            </Section>

            <Section className="text-left my-[24px]">
              <Button
                className="bg-[#09090b] border border-solid border-[#27272a] rounded-md text-white text-[13px] font-semibold no-underline text-center px-[22px] py-[12px] inline-block"
                href="https://erithx.dev/dashboard/settings"
              >
                Link Coding Profiles →
              </Button>
            </Section>

            <Text className="text-[#71717a] dark-text-secondary text-[13px] leading-[21px] mb-[16px]">
              Whatever this week looks like for you — we're rooting for it to end with an offer letter in your inbox, not just ours.
            </Text>

            <Text className="text-[#09090b] dark-text-primary text-[14px] leading-[20px] m-0 font-semibold">
              Debjyoti from ErithX
            </Text>

            <Section className="border-t border-solid border-[#e4e4e7] dark-border mt-[24px] pt-[14px]">
              <Text className="text-[#a1a1aa] dark-text-muted text-[11px] leading-[16px] m-0">
                Account notification for ErithX ·{' '}
                <Link href="https://erithx.dev/dashboard" className="text-[#71717a] dark-text-muted underline">
                  Dashboard
                </Link>
                {' · '}
                <Link href="https://erithx.dev/dashboard/settings" className="text-[#71717a] dark-text-muted underline">
                  Preferences
                </Link>
                {' · '}
                <Link href="https://erithx.dev" className="text-[#71717a] dark-text-muted underline">
                  erithx.dev
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;

