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

interface WeeklyPerformanceEmailProps {
  userName: string;
  previewTextContent: string;
}

export const WeeklyPerformanceEmail = ({ 
  userName = 'Developer',
  previewTextContent = 'Your algorithmic growth and next steps.'
}: WeeklyPerformanceEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>A quick breakdown of your algorithmic growth and next steps.</Preview>
      <Tailwind>
        <Body className="bg-[#f9fafb] my-auto mx-auto font-sans px-2">
          <Container className="bg-white border border-solid border-[#e5e7eb] rounded my-[40px] mx-auto p-[32px] max-w-[560px]">
            <Heading className="text-[#111827] text-[22px] font-bold text-left p-0 my-[0] mx-0">
              Weekly Performance Analysis
            </Heading>
            <Text className="text-[#6b7280] text-[14px] leading-[24px] mt-[8px] mb-[24px]">
              Your latest engineering insights are ready.
            </Text>
            
            <Text className="text-[#374151] text-[15px] leading-[24px]">
              Hi {userName},
            </Text>
            
            <Section className="my-[24px] border-l-4 border-solid border-[#3b82f6] bg-[#f9fafb] px-[20px] py-[16px] rounded-r">
              <Text className="text-[#374151] text-[15px] leading-[24px] italic m-0">
                "{previewTextContent}"
              </Text>
            </Section>

            <Text className="text-[#374151] text-[15px] leading-[24px] mb-[32px]">
              Review your complete breakdown, including your updated trajectory and recommended focus areas for the upcoming week.
            </Text>
            
            <Section className="text-left mt-[32px] mb-[32px]">
              <Button
                className="bg-[#111827] rounded-[6px] text-white text-[14px] font-semibold no-underline text-center px-6 py-3"
                href="https://erithx.dev/dashboard"
              >
                View Full Analysis
              </Button>
            </Section>
            
            <Text className="text-[#374151] text-[15px] leading-[24px]">
              Keep pushing forward.
            </Text>
            <Text className="text-[#374151] text-[15px] leading-[24px] mb-[32px] font-medium">
              — ErithX Core
            </Text>
            
            <Section className="border-t border-solid border-[#e5e7eb] pt-[24px]">
              <Text className="text-[#6b7280] text-[12px] leading-[1.6]">
                You are receiving this performance analysis because it is enabled for your account.
                <br />
                <a href="https://erithx.dev/dashboard/settings" className="text-[#3b82f6] underline">Manage email preferences</a>
              </Text>
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

export default WeeklyPerformanceEmail;
