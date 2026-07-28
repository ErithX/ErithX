// app/api/user/profile/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';

// GET - Fetch user profile
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

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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

    // Validate platform URLs if provided
    const urlValidation = {
      leetcode_url: /^https?:\/\/(www\.)?leetcode\.com\/u?\/[\w-]+\/?$/,
      codeforces_url: /^https?:\/\/(www\.)?codeforces\.com\/profile\/[\w-]+\/?$/,
      codechef_url: /^https?:\/\/(www\.)?codechef\.com\/users\/[\w-]+\/?$/,
      twitter_url: /^https?:\/\/(www\.)?(twitter|x)\.com\/[\w-]+\/?$/,
      linkedin_url: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/,
    };

    const updates: any = {};

    // Validate and prepare updates
    if (body.full_name !== undefined) updates.full_name = body.full_name;
    if (body.email_notifications !== undefined) updates.email_notifications = body.email_notifications;
    if (body.weekly_digest !== undefined) updates.weekly_digest = body.weekly_digest;
    if (body.product_updates !== undefined) updates.product_updates = body.product_updates;
    if (body.company !== undefined) updates.company = body.company;
    if (body.job_title !== undefined) updates.job_title = body.job_title;
    if (body.bio !== undefined) updates.bio = body.bio;
    if (body.twitter_url !== undefined) updates.twitter_url = body.twitter_url;
    if (body.linkedin_url !== undefined) updates.linkedin_url = body.linkedin_url;

    // Validate platform URLs
    for (const [key, regex] of Object.entries(urlValidation)) {
      if (body[key] !== undefined) {
        if (body[key] === '' || body[key] === null) {
          updates[key] = null; // Allow clearing the URL
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

    // Update profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('Profile PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}