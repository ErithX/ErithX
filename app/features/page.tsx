import type { Metadata } from 'next';
import FeaturesClient from './FeaturesClient';

export const metadata: Metadata = {
  title: 'Platform Capabilities | DSA Quest',
  description: 'Explore DSA Quest capabilities: 1-Click Google Calendar contest sync, multi-platform contest tracking, project blueprints with PDFs, and zero-burnout placement prep.',
  keywords: ['DSA Quest Features', 'Coding Contest Sync', 'Placement Blueprints', 'Developer Tools 2026'],
  openGraph: {
    title: 'Platform Capabilities | DSA Quest',
    description: 'Explore DSA Quest capabilities: 1-Click Google Calendar contest sync, multi-platform contest tracking, project blueprints with PDFs.',
    type: 'website',
    url: 'https://dsaquest.com/features',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Platform Capabilities | DSA Quest',
    description: 'Explore DSA Quest capabilities: 1-Click Google Calendar contest sync, multi-platform contest tracking, project blueprints with PDFs.',
  },
};

export default function FeaturesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'DSA Quest Features',
    applicationCategory: 'EducationApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FeaturesClient />
    </>
  );
}