import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import AIReview from '@/models/AIReview';
import { createClient } from '@supabase/supabase-js';
import { sendWeeklyReviewEmail } from '@/app/lib/email/emailService';
import { markReviewEmailSent } from '@/services/ai/reviewStorage';

export const maxDuration = 60; // 60s max execution time
export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function GET(request: Request) {
  try {
    // 1. Verify Cron Authorization
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // 2. Fetch up to 30 AI Reviews that haven't been emailed yet
    const unsentReviews = await AIReview.find({ email_sent: false })
      .sort({ created_at: -1 })
      .limit(30)
      .lean();

    if (!unsentReviews || unsentReviews.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No unsent reviews found.',
      });
    }

    const userIds = unsentReviews.map(r => r.user_id);

    // 3. Fetch user preferences from Supabase
    const { data: users, error: usersError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, full_name, receive_review_emails')
      .in('id', userIds);

    if (usersError) {
      throw new Error(`Failed to fetch user profiles: ${usersError.message}`);
    }

    // Create a map for quick lookup
    const userMap = new Map();
    users?.forEach(u => userMap.set(u.id, u));

    let sentCount = 0;
    let skippedCount = 0;

    for (const review of unsentReviews) {
      const user = userMap.get(review.user_id);

      try {
        // If user doesn't exist or disabled emails, just mark skipped so we don't retry forever
        if (!user || user.receive_review_emails !== true) {
          await markReviewEmailSent(review._id.toString());
          skippedCount++;
          continue;
        }

        // Extract the hook (first ~2 sentences of the review text)
        const text = review.generated_text || '';
        const sentences = text.split(/(?<=[.?!])\s+/);
        const hook = sentences.slice(0, 2).join(' ').trim();

        // Send Email
        const result = await sendWeeklyReviewEmail(
          user.email,
          user.full_name ? user.full_name.split(' ')[0] : 'Coder',
          hook || 'Your weekly performance analysis is ready.'
        );

        if (result.success) {
          await markReviewEmailSent(review._id.toString());
          sentCount++;

          // Log to Supabase
          await supabaseAdmin.from('email_logs').insert({
            user_id: user.id,
            email_type: 'mentor_review',
            recipient_email: user.email,
            subject: `DSA Quest Mentor Review: Weekly Performance Update for ${user.full_name ? user.full_name.split(' ')[0] : 'Coder'}`,
            status: 'sent',
            sent_at: new Date().toISOString(),
          });
        }
      } catch (err: any) {
        console.error(`Error sending review email to ${user?.email || review.user_id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Review emails processed.',
      sent: sentCount,
      skipped: skippedCount
    });

  } catch (error: any) {
    console.error('Send Review Emails Cron Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
