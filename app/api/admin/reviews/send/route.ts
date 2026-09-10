import { NextRequest, NextResponse } from 'next/server';
import { requireSuperadmin, getSupabaseAdminClient } from '@/app/lib/superadmin';
import connectToDatabase from '@/app/lib/mongodb';
import AIReview from '@/models/AIReview';
import { UserCoderProfile } from '@/models/UserCoderProfile';
import { sendWeeklyReviewEmail } from '@/app/lib/email/emailService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const admin = await requireSuperadmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Superadmin access required.' }, { status: 403 });
    }

    const { reviewId, generatedText, targetsSet } = await req.json();
    if (!reviewId) {
      return NextResponse.json({ error: 'Missing reviewId' }, { status: 400 });
    }

    await connectToDatabase();
    const review = await AIReview.findById(reviewId);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Save edited response directly to database so student dashboard & email are 100% updated
    if (generatedText !== undefined && generatedText.trim().length > 0) {
      review.generated_text = generatedText;
    }
    if (targetsSet !== undefined && targetsSet.trim().length > 0) {
      review.targets_set = targetsSet;
    }

    const supabaseAdmin = getSupabaseAdminClient();
    const { data: supaUser } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, full_name')
      .eq('id', review.user_id)
      .single();

    const coderProfile = await UserCoderProfile.findOne({ userId: review.user_id }).lean();
    const targetEmail = supaUser?.email || coderProfile?.userEmail;
    const targetName = supaUser?.full_name?.split(' ')[0] || 'Developer';

    if (!targetEmail) {
      return NextResponse.json({ error: 'No email found for this user.' }, { status: 400 });
    }

    const previewText = review.generated_text || review.hidden_summary || '';
    const res = await sendWeeklyReviewEmail(targetEmail, targetName, previewText);

    if (!res.success) {
      return NextResponse.json({ error: 'Failed to send email via Resend', details: res }, { status: 500 });
    }

    review.email_sent = true;
    review.email_sent_at = new Date();
    await review.save();

    // Log to Supabase email_logs
    await supabaseAdmin.from('email_logs').insert({
      user_id: review.user_id,
      email_type: 'mentor_review',
      recipient_email: targetEmail,
      subject: `Your weekly performance analysis is ready, ${targetName}`,
      status: 'sent',
      sent_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Review email delivered successfully to ${targetEmail}!`
    });
  } catch (err: any) {
    console.error('Error sending review email:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
