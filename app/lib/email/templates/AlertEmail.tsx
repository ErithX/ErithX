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

interface Contest {
  platform: string;
  title: string;
  url: string;
  startTime: string;
  duration: number;
}

interface AlertEmailProps {
  userName: string;
  contest: Contest;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short'
  });
};

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 && m > 0 ? `${h}h ${m}m` : h > 0 ? `${h}h` : `${m}m`;
};

export const AlertEmail = ({ 
  userName = 'Developer',
  contest
}: AlertEmailProps) => {
  const previewText = `Reminder: ${contest?.title} starts soon.`;

  if (!contest) return null;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading className="text-black text-[20px] font-normal text-left p-0 my-[20px] mx-0">
              Contest Reminder
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hey {userName},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              A contest on your watchlist is starting within 24 hours:
            </Text>
            
            <Section className="border border-solid border-[#eaeaea] bg-[#f9fafb] rounded p-4 mb-4">
              <Text className="text-[11px] font-bold text-[#666666] uppercase m-0 tracking-wide">
                {contest.platform}
              </Text>
              <Text className="text-[17px] font-bold text-black m-0 mt-2 mb-3">
                {contest.title}
              </Text>
              <Text className="text-[13px] text-[#666666] m-0 mb-1">
                <strong>Date:</strong> {formatDate(contest.startTime)}
              </Text>
              <Text className="text-[13px] text-[#666666] m-0 mb-1">
                <strong>Time:</strong> {formatTime(contest.startTime)}
              </Text>
              <Text className="text-[13px] text-[#666666] m-0 mb-4">
                <strong>Duration:</strong> {formatDuration(contest.duration)}
              </Text>
              <Button
                className="bg-[#059669] rounded text-white text-[12px] font-semibold no-underline text-center px-4 py-2"
                href={contest.url}
              >
                Join Contest
              </Button>
            </Section>
            
            <Section className="border-t border-solid border-[#eaeaea] pt-[20px] mt-[32px]">
              <Text className="text-[#666666] text-[12px] leading-[24px]">
                You are receiving this because you enabled contest alerts.
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

export default AlertEmail;
