import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface MissingProfilesEmailProps {
  userName: string;
}

export const MissingProfilesEmail = ({ 
  userName = 'Developer'
}: MissingProfilesEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>We can't track what you don't connect.</Preview>
      <Tailwind>
        <Body className="bg-[#f9fafb] my-auto mx-auto font-sans px-2">
          <Container className="bg-white border border-solid border-[#e5e7eb] rounded my-[40px] mx-auto p-[32px] max-w-[560px]">
            <Heading className="text-[#111827] text-[22px] font-bold text-left p-0 my-[0] mx-0">
              Action Required: Missing Profiles
            </Heading>
            <Text className="text-[#6b7280] text-[14px] leading-[24px] mt-[8px] mb-[24px]">
              Your ErithX profile is currently empty.
            </Text>
            
            <Text className="text-[#374151] text-[15px] leading-[24px]">
              Hi {userName},
            </Text>
            
            <Text className="text-[#374151] text-[15px] leading-[24px]">
              You registered for ErithX, but you haven't linked your LeetCode, Codeforces, or other platform profiles yet.
            </Text>
            
            <Text className="text-[#374151] text-[15px] leading-[24px]">
              Our system cannot run your weekly performance delta, analyze your progress, or generate your career roadmap until we have data to process. We rely strictly on your actual coding behavior—not estimates.
            </Text>

            <Text className="text-[#374151] text-[15px] leading-[24px] mb-[32px]">
              Take 30 seconds to connect your profiles now so our system can generate your first baseline performance review this Sunday.
            </Text>
            
            <Section className="text-left mt-[32px] mb-[32px]">
              <Button
                className="bg-[#111827] rounded-[6px] text-white text-[14px] font-semibold no-underline text-center px-6 py-3"
                href="https://erithx.dev/dashboard/settings"
              >
                Connect My Profiles
              </Button>
            </Section>
            
            <Text className="text-[#374151] text-[15px] leading-[24px]">
              <a href="https://erithx.dev/docs/performance-analysis" className="text-[#10b981] underline">See how it works?</a>
            </Text>

            <Text className="text-[#374151] text-[15px] leading-[24px] mt-[24px]">
              Keep pushing forward.
            </Text>
            <Text className="text-[#374151] text-[15px] leading-[24px] mb-[32px] font-medium">
              — ErithX Team
            </Text>
            
            <Section className="border-t border-solid border-[#e5e7eb] pt-[24px]">
              <Text className="text-[#9ca3af] text-[11px] leading-[1.6] mt-[8px]">
                ErithX · Built for modern developers.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default MissingProfilesEmail;
