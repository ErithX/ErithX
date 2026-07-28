// app/api/test-email/route.ts
import { NextResponse } from 'next/server';
import { sendWelcomeEmail, sendDailyContestDigest, sendContestAlert, sendProductUpdate } from '@/app/lib/email/emailService';
import { createClient } from '@/app/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({
        error: 'Not authenticated. Please login first.'
      }, { status: 401 });
    }

    const userEmail = user.email!;
    const userName = user.user_metadata?.full_name || 'Test User';

    const { searchParams } = new URL(request.url);
    const testType = searchParams.get('type') || 'welcome';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (testType === 'welcome') {
      const result = await sendWelcomeEmail(userEmail, userName);

      return NextResponse.json({
        success: result.success,
        testType: 'Welcome Email',
        recipientEmail: userEmail,
        recipientName: userName,
        messageId: 'messageId' in result ? result.messageId : null,
        message: result.success
          ? 'Welcome email sent to ' + userEmail
          : 'Failed to send email. Check server logs.',
        error: 'error' in result ? result.error : null,
      });
    }

    if (testType === 'digest') {
      console.log('Fetching contests from: ' + appUrl + '/api/contests');

      const contestsResponse = await fetch(appUrl + '/api/contests', {
        cache: 'no-store',
      });

      if (!contestsResponse.ok) {
        throw new Error('Failed to fetch contests');
      }

      const contestsData = await contestsResponse.json();

      if (!contestsData.success) {
        throw new Error('Failed to fetch contests from API');
      }

      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const upcomingContests = contestsData.contests.filter((contest: any) => {
        const startTime = new Date(contest.startTime);
        return startTime >= now && startTime <= weekFromNow;
      });

      console.log('Found ' + upcomingContests.length + ' contests in next 7 days');

      if (upcomingContests.length === 0) {
        return NextResponse.json({
          success: true,
          testType: 'Daily Digest Email',
          recipientEmail: userEmail,
          recipientName: userName,
          contestsCount: 0,
          message: 'No contests found in next 7 days. No email sent.',
          hint: 'The system only sends emails when there are actual upcoming contests.',
        });
      }

      const result = await sendDailyContestDigest(userEmail, userName, upcomingContests);

      return NextResponse.json({
        success: result.success,
        testType: 'Daily Digest Email',
        recipientEmail: userEmail,
        recipientName: userName,
        contestsCount: upcomingContests.length,
        contests: upcomingContests.map((c: any) => ({
          platform: c.platform,
          title: c.title,
          startTime: c.startTime,
        })),
        messageId: 'messageId' in result ? result.messageId : null,
        message: result.success
          ? 'Daily digest sent to ' + userEmail + ' with ' + upcomingContests.length + ' contest(s).'
          : 'Failed to send email. Check server logs.',
        error: 'error' in result ? result.error : null,
      });
    }

    if (testType === 'alert') {
      const sampleContest = {
        platform: 'LeetCode',
        title: 'Weekly Contest 400',
        url: 'https://leetcode.com/contest/weekly-contest-400',
        startTime: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
        duration: 3600,
      };

      const result = await sendContestAlert(userEmail, userName, sampleContest);

      return NextResponse.json({
        success: result.success,
        testType: 'Contest Alert',
        recipientEmail: userEmail,
        recipientName: userName,
        contest: sampleContest,
        messageId: 'messageId' in result ? result.messageId : null,
        message: result.success
          ? 'Contest alert sent to ' + userEmail + '.'
          : 'Failed to send email. Check server logs.',
        error: 'error' in result ? result.error : null,
      });
    }

    if (testType === 'product') {
      const result = await sendProductUpdate(
        userEmail,
        userName,
        'New Feature: Achievement Cards',
        'You can now earn achievement cards for completing contests, solving problems, and maintaining streaks. Track your progress and share your achievements with the community.',
        appUrl + '/dashboard'
      );

      return NextResponse.json({
        success: result.success,
        testType: 'Product Update',
        recipientEmail: userEmail,
        recipientName: userName,
        messageId: 'messageId' in result ? result.messageId : null,
        message: result.success
          ? 'Product update email sent to ' + userEmail + '.'
          : 'Failed to send email. Check server logs.',
        error: 'error' in result ? result.error : null,
      });
    }

    return NextResponse.json({
      error: 'Invalid test type',
      validTypes: ['welcome', 'digest', 'alert', 'product'],
      examples: [
        '/api/test-email?type=welcome',
        '/api/test-email?type=digest',
        '/api/test-email?type=alert',
        '/api/test-email?type=product',
      ]
    }, { status: 400 });

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      hint: 'Check email configuration in .env and server logs'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
