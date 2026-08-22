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

interface MentorReportEmailProps {
  userName: string;
  projectTitle: string;
  aiFeedbackText: string;
}

export const MentorReportEmail = ({ 
  userName = 'Developer',
  projectTitle = 'Your Project',
  aiFeedbackText = 'Your architecture review is complete. We found a few critical areas for improvement.'
}: MentorReportEmailProps) => {
  const previewText = `Your weekly review is ready.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading className="text-black text-[20px] font-normal text-left p-0 my-[20px] mx-0">
              Your review is ready.
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hi {userName},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Here is the honest summary for your submission: <strong>{projectTitle}</strong>.
            </Text>
            
            <Section className="bg-[#f9fafb] border border-solid border-[#eaeaea] rounded p-4 my-4">
              <Text className="text-[#374151] text-[14px] leading-[24px] m-0 italic">
                "{aiFeedbackText}"
              </Text>
            </Section>
            
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#059669] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href="https://erithx.dev/mentor"
              >
                View Full Analysis
              </Button>
            </Section>
            
            <Text className="text-black text-[14px] leading-[24px] mb-[32px]">
              Keep building,<br/>
              ErithX AI Mentor
            </Text>
            
            <Section className="border-t border-solid border-[#eaeaea] pt-[20px]">
              <Text className="text-[#666666] text-[12px] leading-[24px]">
                This is an automated report from the ErithX AI Mentor.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default MentorReportEmail;
