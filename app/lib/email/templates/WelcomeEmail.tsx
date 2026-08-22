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

export const WelcomeEmail = ({ userName = 'Developer' }: WelcomeEmailProps) => {
  const previewText = `Welcome to ErithX`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Welcome to <strong>ErithX</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {userName},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Welcome to ErithX. Our goal is to provide a zero-noise, highly focused environment for your coding contest tracking and placement preparation.
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              You can instantly sync upcoming contests to your calendar and dive into our curated system design roadmaps.
            </Text>
            
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#0f172a] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href="https://erithx.dev/contests"
              >
                Browse Contests
              </Button>
            </Section>
            
            <Text className="text-black text-[14px] leading-[24px]">
              Stay focused, avoid the burnout, and build your craftsmanship.
            </Text>
            <Text className="text-black text-[14px] leading-[24px] mb-[32px]">
              — Debjyoti from ErithX
            </Text>
            
            <Section className="border-t border-solid border-[#eaeaea] pt-[20px]">
              <Text className="text-[#666666] text-[12px] leading-[24px]">
                You received this email because you signed up for ErithX.
                <br />
                ErithX · Built for modern developers.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
