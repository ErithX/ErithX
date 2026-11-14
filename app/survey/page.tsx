import React from 'react';
import type { Metadata } from 'next';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient as createAuthClient } from '@/app/lib/supabase/server';
import SurveyClient, { SurveyQuestion } from '@/components/survey/SurveyClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Feedback Survey | ErithX',
  description: 'Share your honest feedback on ErithX weekly AI reviews and coding contest tracking.',
  openGraph: {
    title: 'ErithX Survey — Help Shape the Future of ErithX',
    description: 'Share your honest feedback on ErithX weekly AI reviews and coding contest tracking.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ErithX — Track contests. Review habits. Level up every week.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ErithX Survey — Help Shape the Future of ErithX',
    description: 'Share your honest feedback on ErithX weekly AI reviews and coding contest tracking.',
    images: ['/og-image.jpg'],
  },
};

interface SurveyPageProps {
  searchParams: Promise<{
    uid?: string;
    token?: string;
    email?: string;
    em?: string;
  }>;
}

export default async function SurveyPage({ searchParams }: SurveyPageProps) {
  const params = await searchParams;
  let userId = params.uid || '';
  let userEmail = params.email || params.em || '';

  // 1. If a signed token is provided, extract uid & email from payload
  if ((!userId || !userEmail) && params.token && params.token.includes('.')) {
    try {
      const [encodedPayload] = params.token.split('.');
      const padding = '='.repeat((4 - (encodedPayload.length % 4)) % 4);
      const jsonStr = Buffer.from(encodedPayload + padding, 'base64url').toString('utf8');
      const payload = JSON.parse(jsonStr);
      if (payload.uid && !userId) userId = payload.uid;
      if (payload.em && !userEmail) userEmail = payload.em;
    } catch (e) {
      // Fallback silently if token is malformed
    }
  }

  // 2. If visiting from Website Dashboard (or no query params), extract from active auth session
  if (!userId || !userEmail) {
    try {
      const supabaseAuth = await createAuthClient();
      const { data: { user } } = await supabaseAuth.auth.getUser();
      if (user?.id && !userId) {
        userId = user.id;
      }
      if (user?.email && !userEmail) {
        userEmail = user.email;
      }
    } catch (e) {
      // Unauthenticated visitor
    }
  }

  // Fetch questions and options joined from Supabase using Service Role Key
  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: rawQuestions, error } = await supabase
    .from('questions')
    .select(`
      id,
      text,
      is_multi,
      options (
        id,
        label
      )
    `)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching questions from Supabase:', error);
  }

  // Ensure options are sorted by id ascending
  const questions: SurveyQuestion[] = (rawQuestions || []).map((q: any) => ({
    id: q.id,
    text: q.text,
    is_multi: Boolean(q.is_multi),
    options: (q.options || []).sort((a: any, b: any) => a.id - b.id)
  }));

  return <SurveyClient questions={questions} userId={userId} userEmail={userEmail} />;
}

