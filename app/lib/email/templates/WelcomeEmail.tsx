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
        <Body className="bg-[#08080a] my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#27272a] rounded-xl my-[40px] mx-auto p-[28px] max-w-[480px] bg-[#09090b] text-[#d4d4d8]">
            <Heading className="text-white text-[20px] font-semibold tracking-tight p-0 my-[16px] mx-0">
              Welcome inside ✨
            </Heading>
            
            <Text className="text-[#e4e4e7] text-[15px] leading-[24px] mb-[16px]">
              Hey {userName},
            </Text>

            <Text className="text-[#a1a1aa] text-[14px] leading-[24px] mb-[20px]">
              We built ErithX around a simple belief: growing as a software engineer shouldn’t mean grinding in the dark. It’s about steady consistency, working with intent, and actually seeing your progress.
            </Text>

            <Section className="bg-[#18181b]/60 border border-solid border-[#27272a] rounded-lg p-[16px] mb-[24px]">
              <Text className="text-white text-[14px] font-semibold m-0 mb-[6px]">
                1. Connect your accounts
              </Text>
              <Text className="text-[#a1a1aa] text-[13px] leading-[20px] m-0 mb-[14px]">
                Head to <Link href="https://erithx.dev/dashboard/settings" className="text-emerald-400 underline">Settings → Coding Profiles</Link> and link your LeetCode, GitHub, or Codeforces handles. (Takes 30 seconds — only public usernames, no passwords).
              </Text>

              <Text className="text-white text-[14px] font-semibold m-0 mb-[6px]">
                2. Watch your inbox this Sunday at 9:00 PM
              </Text>
              <Text className="text-[#a1a1aa] text-[13px] leading-[20px] m-0">
                Every Sunday evening, we review your week’s problem-solving rhythm and send you a friendly, honest breakdown along with a focused 7-day plan for the week ahead.
              </Text>
            </Section>

            <Section className="text-center my-[28px]">
              <Button
                className="bg-emerald-500 hover:bg-emerald-400 rounded-lg text-black text-[13px] font-semibold no-underline text-center px-6 py-3"
                href="https://erithx.dev/dashboard/settings"
              >
                Connect Your Profiles →
              </Button>
            </Section>

            <Text className="text-[#a1a1aa] text-[13px] leading-[22px] mb-[24px]">
              Got any questions or ideas? Just hit reply to this email—it goes straight to my personal inbox.
            </Text>

            <Text className="text-[#e4e4e7] text-[14px] leading-[22px] m-0 font-medium">
              Debjyoti from ErithX
            </Text>

            <Section className="border-t border-solid border-[#27272a] mt-[24px] pt-[16px]">
              <Text className="text-[#71717a] text-[11px] leading-[18px] m-0">
                You received this because you created an account on ErithX.
                <br />
                <Link href="https://erithx.dev/dashboard/settings" className="text-[#a1a1aa] underline">
                  Manage preferences
                </Link>
                {' · '}
                <Link href="https://erithx.dev" className="text-[#a1a1aa] underline">
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
