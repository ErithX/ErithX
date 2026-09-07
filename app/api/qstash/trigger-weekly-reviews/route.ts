import { NextResponse } from 'next/server';
import { Client } from '@upstash/qstash';
import { createClient } from '@supabase/supabase-js';
import connectToDatabase from '@/app/lib/mongodb';
import { UserCoderProfile } from '@/models/UserCoderProfile';

export const maxDuration = 60; // 60s is plenty to just query DB and publish 100 messages
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  try {
    // 1. Verify Trigger Authorization (either QStash Cron or Vercel Cron)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); // Uncomment for strict prod
    }

    if (!process.env.QSTASH_TOKEN) {
      throw new Error("QSTASH_TOKEN is missing in environment variables.");
    }

    const qstash = new Client({ token: process.env.QSTASH_TOKEN });
    const rawAppUrl = 
      process.env.NEXT_PUBLIC_APP_URL || 
      process.env.NEXT_PUBLIC_NEW_DOMAIN || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://erithx.dev');
    const appUrl = rawAppUrl.includes('localhost') && process.env.NODE_ENV === 'production'
      ? (process.env.NEXT_PUBLIC_NEW_DOMAIN || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://erithx.dev'))
      : rawAppUrl;

    // 2. Fetch Users from Supabase who have mentor_review_enabled !== false
    const { data: activeUsers, error } = await supabase
      .from('user_profiles')
      .select('id, mentor_review_enabled')
      .neq('mentor_review_enabled', false);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!activeUsers || activeUsers.length === 0) {
      return NextResponse.json({ message: 'No active users opted in for AI reviews.' });
    }

    const validUserIds = activeUsers.map(u => u.id);

    await connectToDatabase();

    // 3. Fetch from MongoDB to ensure they have at least 1 coding profile attached
    const profiles = await UserCoderProfile.find({
      userId: { $in: validUserIds },
      $or: [
        { 'platforms.leetcode.handle': { $exists: true, $ne: '' } },
        { 'platforms.github.handle': { $exists: true, $ne: '' } },
        { 'platforms.codeforces.handle': { $exists: true, $ne: '' } },
      ],
    }).select('userId');

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users with connected coder profiles found among opted-in users.',
        processed: 0,
      });
    }

    // 4. Publish a job to QStash for each valid user
    const cleanAppUrl = appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl;

    const publishPromises = profiles.map(profile => {
      return qstash.publishJSON({
        url: `${cleanAppUrl}/api/qstash/process-user-review`,
        body: { userId: profile.userId },
        retries: 3, // If Vercel timeouts/fails, QStash will retry up to 3 times
      });
    });

    const results = await Promise.allSettled(publishPromises);
    
    const errors: any[] = [];
    results.forEach((r, idx) => {
      if (r.status === 'rejected') {
        console.error(`Failed to publish job ${idx}:`, r.reason);
        errors.push(r.reason?.message || r.reason);
      }
    });

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({
      success: true,
      message: `Triggered ${successful} review jobs in QStash. Failed to trigger ${failed}.`,
      errors,
      totalEligible: profiles.length
    });

  } catch (error: any) {
    console.error('Error triggering weekly reviews:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
