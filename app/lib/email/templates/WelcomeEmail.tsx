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
  const previewText = `A quick note before your first Sunday review on ErithX`;

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
            .dark-text-primary {
              color: #f3f4f6 !important;
            }
            .dark-text-secondary {
              color: #9ca3af !important;
            }
            .dark-text-muted {
              color: #6b7280 !important;
            }
            .dark-border {
              border-color: #27272a !important;
            }
          }
        `}</style>
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="my-auto mx-auto font-sans px-2" style={{ margin: 'auto', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
          <Container className="my-[32px] mx-auto p-[24px] max-w-[500px]">
            <Heading className="text-[#111827] dark-text-primary text-[20px] font-semibold tracking-tight p-0 my-[16px] mx-0">
              Welcome inside ✨
            </Heading>
            
            <Text className="text-[#111827] dark-text-primary text-[15px] leading-[24px] mb-[16px]">
              Hey {userName},
            </Text>

            <Text className="text-[#4b5563] dark-text-secondary text-[14px] leading-[24px] mb-[20px]">
              We built ErithX around a simple belief: growing as a software engineer shouldn’t mean grinding in the dark. It’s about steady consistency, working with intent, and actually seeing your progress.
            </Text>

            <Section className="border-l-2 border-solid border-[#10b981] pl-[18px] py-[4px] my-[24px]">
              <Text className="text-[#111827] dark-text-primary text-[14px] font-semibold m-0 mb-[6px]">
                1. Connect your coding profiles
              </Text>
              <Text className="text-[#4b5563] dark-text-secondary text-[13px] leading-[20px] m-0 mb-[16px]">
                Head to <Link href="https://erithx.dev/dashboard/settings" className="text-[#10b981] underline font-medium">Dashboard → Settings → Coding Profiles</Link> and link your LeetCode, Codeforces, GitHub (or any platform you actively use). Takes 30 seconds—only public handles, never passwords.
              </Text>

              <Text className="text-[#111827] dark-text-primary text-[14px] font-semibold m-0 mb-[6px]">
                2. Watch your inbox this Sunday at 9:00 PM
              </Text>
              <Text className="text-[#4b5563] dark-text-secondary text-[13px] leading-[20px] m-0">
                Every Sunday evening, we review your week’s problem-solving rhythm and send you an honest breakdown along with a focused 7-day plan for the week ahead.
              </Text>
            </Section>

            <Section className="text-left my-[28px]">
              <Button
                className="bg-[#10b981] rounded-lg text-white text-[13px] font-semibold no-underline text-center px-6 py-3 inline-block"
                style={{ backgroundColor: '#10b981', color: '#ffffff' }}
                href="https://erithx.dev/dashboard/settings"
              >
                Connect Your Profiles →
              </Button>
            </Section>

            <Text className="text-[#4b5563] dark-text-secondary text-[13px] leading-[22px] mb-[24px]">
              Got any questions or ideas? Just hit reply to this email—it goes straight to my personal inbox.
            </Text>

            <Text className="text-[#111827] dark-text-primary text-[14px] leading-[22px] m-0 font-semibold">
              Debjyoti from ErithX
            </Text>

            <Section className="border-t border-solid border-[#e5e7eb] dark-border mt-[28px] pt-[16px]">
              <Text className="text-[#9ca3af] dark-text-muted text-[11px] leading-[18px] m-0">
                You received this because you created an account on ErithX.
                <br />
                <Link href="https://erithx.dev/dashboard/settings" className="text-[#6b7280] dark-text-muted underline">
                  Manage preferences
                </Link>
                {' · '}
                <Link href="https://erithx.dev" className="text-[#6b7280] dark-text-muted underline">
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
