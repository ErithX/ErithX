// app/api/user/profile/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import connectToDatabase from '@/app/lib/mongodb';
import { User } from '@/models/User';

// GET - Fetch user profile
// WHY MERGED RESPONSE: Supabase user_profiles owns all UI-facing fields (bio, socials,
// email prefs). MongoDB User owns mentorPrefs because the AI review engine reads it from
// there. Supabase has no mentorPrefs column. We merge here so the settings page gets
// everything in one call. This avoids a schema migration for now.
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    // Merge mentorPrefs from MongoDB (AI engine source of truth for this field)
    let mentorPrefs = null;
    try {
      await connectToDatabase();
      const mongoUser = await User.findOne({ supabaseId: user.id }).lean() as any;
      mentorPrefs = mongoUser?.mentorPrefs || null;
    } catch (e) {
      console.warn('[PROFILE GET] Could not fetch mentorPrefs from MongoDB:', e);
    }

    return NextResponse.json({
      success: true,
      profile: { ...profile, mentorPrefs },
    });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update user profile
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const urlValidation: Record<string, RegExp> = {
      leetcode_url: /^https?:\/\/(www\.)?leetcode\.com\/u?\/[\w-]+\/?$/,
      codeforces_url: /^https?:\/\/(www\.)?codeforces\.com\/profile\/[\w-]+\/?$/,
      codechef_url: /^https?:\/\/(www\.)?codechef\.com\/users\/[\w-]+\/?$/,
      twitter_url: /^https?:\/\/(www\.)?(twitter|x)\.com\/[\w-]+\/?$/,
      linkedin_url: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/,
    };

    const updates: any = {};

    if (body.full_name !== undefined) updates.full_name = body.full_name;
    if (body.email_notifications !== undefined) updates.email_notifications = body.email_notifications;
    if (body.weekly_digest !== undefined) updates.weekly_digest = body.weekly_digest;
    if (body.product_updates !== undefined) updates.product_updates = body.product_updates;
    if (body.mentor_review_enabled !== undefined) updates.mentor_review_enabled = body.mentor_review_enabled;
    if (body.company !== undefined) updates.company = body.company;
    if (body.job_title !== undefined) updates.job_title = body.job_title;
    if (body.bio !== undefined) updates.bio = body.bio;
    if (body.twitter_url !== undefined) updates.twitter_url = body.twitter_url;
    if (body.linkedin_url !== undefined) updates.linkedin_url = body.linkedin_url;
    // account_status: user can only set to 'pending' (reactivation request)
    // Admin sets to 'active' or 'inactive' via admin routes
    if (body.account_status === 'pending') updates.account_status = 'pending';


    for (const [key, regex] of Object.entries(urlValidation)) {
      if (body[key] !== undefined) {
        if (body[key] === '' || body[key] === null) {
          updates[key] = null;
        } else if (regex.test(body[key])) {
          updates[key] = body[key];
        } else {
          return NextResponse.json(
            { error: `Invalid ${key.replace('_url', '')} URL format` },
            { status: 400 }
          );
        }
      }
    }

    // --- mentorPrefs → MongoDB User ---
    // WHY NOT SUPABASE: Supabase user_profiles has no mentorPrefs column. The AI review
    // generator (process-user-review/route.ts) reads User.mentorPrefs from MongoDB.
    // MongoDB is the authoritative source for this field until a future migration.
    if (body.mentorPrefs !== undefined) {
      try {
        await connectToDatabase();
        await User.findOneAndUpdate(
          { supabaseId: user.id },
          { $set: { mentorPrefs: body.mentorPrefs } },
          { upsert: true }
        );
      } catch (mongoErr) {
        console.error('[PROFILE PATCH] Failed to save mentorPrefs to MongoDB:', mongoErr);
        // Non-fatal — don't block the Supabase update for this
      }
    }

    // If nothing to update in Supabase (mentorPrefs-only save), return early
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: true });
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('Profile PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}