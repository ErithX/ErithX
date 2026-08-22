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

interface DigestEmailProps {
  userName: string;
  contests: Contest[];
  topResource?: any;
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

export const DigestEmail = ({ 
  userName = 'Developer',
  contests = [],
  topResource
}: DigestEmailProps) => {
  const previewText = `${contests.length} contest${contests.length > 1 ? 's' : ''} starting soon.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading className="text-black text-[20px] font-normal text-left p-0 my-[20px] mx-0">
              Your Contest Digest
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hey {userName}, here {contests.length === 1 ? 'is' : 'are'} <strong>{contests.length} contest{contests.length > 1 ? 's' : ''}</strong> starting in the next 24 hours.
            </Text>
            
            {contests.map((c, i) => (
              <Section key={i} className="border border-solid border-[#eaeaea] rounded p-4 mb-4">
                <Text className="text-[11px] font-bold text-[#666666] uppercase m-0 tracking-wide">
                  {c.platform} <span className="font-normal float-right">{formatDuration(c.duration)}</span>
                </Text>
                <Text className="text-[15px] font-bold text-black m-0 mt-2 mb-1">
                  {c.title}
                </Text>
                <Text className="text-[13px] text-[#666666] m-0 mb-3">
                  {formatDate(c.startTime)} at {formatTime(c.startTime)}
                </Text>
                <Link href={c.url} className="text-[#3b82f6] text-[13px] font-semibold no-underline">
                  View Contest &rarr;
                </Link>
              </Section>
            ))}
            
            {topResource && (
              <Section className="border border-solid border-[#eaeaea] rounded p-4 mt-8">
                <Text className="text-[14px] font-bold text-black m-0 mb-2">Top Resource For You</Text>
                <Text className="text-[15px] font-bold text-black m-0 mb-1">{topResource.title}</Text>
                {topResource.subtitle && <Text className="text-[13px] text-[#666666] m-0 mb-3">{topResource.subtitle}</Text>}
                <Link href={`https://erithx.dev/resources/${topResource.slug || topResource._id}`} className="text-[#3b82f6] text-[13px] font-semibold no-underline">
                  Read Now &rarr;
                </Link>
              </Section>
            )}
            
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#0f172a] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href="https://erithx.dev/contests"
              >
                View All Contests
              </Button>
            </Section>
            
            <Section className="border-t border-solid border-[#eaeaea] pt-[20px]">
              <Text className="text-[#666666] text-[12px] leading-[24px]">
                You received this digest because you are subscribed on ErithX.
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

export default DigestEmail;
