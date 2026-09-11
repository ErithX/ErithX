import { NextRequest, NextResponse } from 'next/server';
import { requireSuperadmin, getSupabaseAdminClient } from '@/app/lib/superadmin';
import connectToDatabase from '@/app/lib/mongodb';
import { UserCoderProfile } from '@/models/UserCoderProfile';
import AIReview from '@/models/AIReview';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const admin = await requireSuperadmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Superadmin access required.' }, { status: 403 });
    }

    await connectToDatabase();
    const supabaseAdmin = getSupabaseAdminClient();

    // 1. Fetch all Coder Profiles with at least 1 platform connected
    const coderProfiles = await UserCoderProfile.find({
      $or: [
        { 'platforms.leetcode.handle': { $exists: true, $ne: null } },
        { 'platforms.codeforces.handle': { $exists: true, $ne: null } },
        { 'platforms.github.handle': { $exists: true, $ne: null } },
      ]
    }).lean();

    const userIds = coderProfiles.map(cp => cp.userId);

    // 2. Fetch User metadata from Supabase
    const { data: supaUsers } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, full_name, avatar_url, mentor_review_enabled, receive_review_emails')
      .in('id', userIds);

    const supaMap = new Map();
    supaUsers?.forEach(u => supaMap.set(u.id, u));

    // Filter out orphaned profiles (users deleted from Supabase) and asynchronously prune them from MongoDB
    const orphanUserIds: string[] = [];
    const activeProfiles = coderProfiles.filter(cp => {
      if (!supaMap.has(cp.userId)) {
        orphanUserIds.push(cp.userId);
        return false;
      }
      return true;
    });

    if (orphanUserIds.length > 0) {
      UserCoderProfile.deleteMany({ userId: { $in: orphanUserIds } })
        .exec()
        .catch(err => console.error('Failed to prune orphaned UserCoderProfiles:', err));
    }

    // 3. Fetch all AI Reviews for each active user (to support history timeline and Roy factor tracking)
    const usersWithReviews = await Promise.all(
      activeProfiles.map(async (cp: any) => {
        const supaUser = supaMap.get(cp.userId);
        const allUserReviews = await AIReview.find({ user_id: cp.userId })
          .sort({ created_at: -1 })
          .lean();

        const reviews = allUserReviews.map((r: any) => ({
          id: r._id.toString(),
          generatedText: r.generated_text,
          targetsSet: r.targets_set,
          hiddenSummary: r.hidden_summary,
          modelUsed: r.model_used,
          promptTokensUsed: r.prompt_tokens_used,
          royFactor: r.roy_factor ?? 0,
          adminNote: r.admin_note,
          emailSent: r.email_sent,
          emailSentAt: r.email_sent_at,
          createdAt: r.created_at,
        }));

        const latestReview = reviews[0] || null;
        const activeRoyFactor = latestReview?.royFactor ?? 0;

        return {
          userId: cp.userId,
          email: supaUser?.email || cp.userEmail || 'No email',
          fullName: supaUser?.full_name || 'Coder',
          avatarUrl: supaUser?.avatar_url || cp.platforms?.leetcode?.avatar || cp.platforms?.github?.avatar || null,
          mentorReviewEnabled: supaUser?.mentor_review_enabled ?? true,
          platforms: cp.platforms || {},
          otherUrls: cp.otherUrls || [],
          pendingAdminNote: cp.pendingAdminNote || '',
          totalReviewsCount: reviews.length,
          activeRoyFactor,
          reviews,
          latestReview
        };
      })
    );

    return NextResponse.json({ success: true, users: usersWithReviews });
  } catch (err: any) {
    console.error('Error fetching admin reviews users:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

// Update pending admin note for a user
export async function POST(req: NextRequest) {
  try {
    const admin = await requireSuperadmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Superadmin access required.' }, { status: 403 });
    }

    const { userId, pendingAdminNote } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    await connectToDatabase();
    await UserCoderProfile.updateOne(
      { userId },
      { $set: { pendingAdminNote: pendingAdminNote || '' } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Admin note updated.' });
  } catch (err: any) {
    console.error('Error saving admin note:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

// Edit existing review text before sending
export async function PUT(req: NextRequest) {
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
    const updated = await AIReview.findByIdAndUpdate(
      reviewId,
      {
        $set: {
          ...(generatedText !== undefined ? { generated_text: generatedText } : {}),
          ...(targetsSet !== undefined ? { targets_set: targetsSet } : {})
        }
      },
      { new: true }
    );

    return NextResponse.json({ success: true, review: updated });
  } catch (err: any) {
    console.error('Error updating review:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
