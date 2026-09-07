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
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-[#f4f5f7] my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#e5e7eb] rounded-xl my-[40px] mx-auto p-[32px] max-w-[480px] bg-[#ffffff] text-[#374151] shadow-sm">
            <Heading className="text-[#111827] text-[20px] font-semibold tracking-tight p-0 my-[16px] mx-0">
              Welcome inside ✨
            </Heading>
            
            <Text className="text-[#111827] text-[15px] leading-[24px] mb-[16px]">
              Hey {userName},
            </Text>

            <Text className="text-[#4b5563] text-[14px] leading-[24px] mb-[20px]">
              We built ErithX around a simple belief: growing as a software engineer shouldn’t mean grinding in the dark. It’s about steady consistency, working with intent, and actually seeing your progress.
            </Text>

            <Section className="bg-[#f9fafb] border border-solid border-[#e5e7eb] rounded-lg p-[18px] mb-[24px]">
              <Text className="text-[#111827] text-[14px] font-semibold m-0 mb-[6px]">
                1. Connect your accounts
              </Text>
              <Text className="text-[#4b5563] text-[13px] leading-[20px] m-0 mb-[14px]">
                Head to <Link href="https://erithx.dev/dashboard/settings" className="text-[#059669] underline font-medium">Settings → Coding Profiles</Link> and link your LeetCode, GitHub, or Codeforces handles. (Takes 30 seconds — only public usernames, no passwords).
              </Text>

              <Text className="text-[#111827] text-[14px] font-semibold m-0 mb-[6px]">
                2. Watch your inbox this Sunday at 9:00 PM
              </Text>
              <Text className="text-[#4b5563] text-[13px] leading-[20px] m-0">
                Every Sunday evening, we review your week’s problem-solving rhythm and send you a friendly, honest breakdown along with a focused 7-day plan for the week ahead.
              </Text>
            </Section>

            <Section className="text-center my-[28px]">
              <Button
                className="bg-[#0f172a] rounded-lg text-white text-[13px] font-semibold no-underline text-center px-6 py-3"
                href="https://erithx.dev/dashboard/settings"
              >
                Connect Your Profiles →
              </Button>
            </Section>

            <Text className="text-[#4b5563] text-[13px] leading-[22px] mb-[24px]">
              Got any questions or ideas? Just hit reply to this email—it goes straight to my personal inbox.
            </Text>

            <Text className="text-[#111827] text-[14px] leading-[22px] m-0 font-semibold">
              Debjyoti from ErithX
            </Text>

            <Section className="border-t border-solid border-[#e5e7eb] mt-[24px] pt-[16px]">
              <Text className="text-[#9ca3af] text-[11px] leading-[18px] m-0">
                You received this because you created an account on ErithX.
                <br />
                <Link href="https://erithx.dev/dashboard/settings" className="text-[#6b7280] underline">
                  Manage preferences
                </Link>
                {' · '}
                <Link href="https://erithx.dev" className="text-[#6b7280] underline">
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
