import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import connectToDatabase from '@/app/lib/mongodb';
import { UserCoderProfile } from '@/models/UserCoderProfile';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    let profile = await UserCoderProfile.findOne({ userId: user.id }).lean() as any;

    if (!profile) {
      // Check if legacy handles exist in Supabase user_profiles
      const { data: spProfile } = await supabase
        .from('user_profiles')
        .select('leetcode_url, codeforces_url, github_username')
        .eq('id', user.id)
        .single();

      const initialPlatforms: any = {};

      if (spProfile?.leetcode_url) {
        initialPlatforms.leetcode = {
          handle: spProfile.leetcode_url.split('/').filter(Boolean).pop() || '',
          url: spProfile.leetcode_url,
          verified: true,
          lastVerifiedAt: new Date()
        };
      }
      if (spProfile?.codeforces_url) {
        initialPlatforms.codeforces = {
          handle: spProfile.codeforces_url.split('/').filter(Boolean).pop() || '',
          url: spProfile.codeforces_url,
          verified: true,
          lastVerifiedAt: new Date()
        };
      }
      if (spProfile?.github_username) {
        initialPlatforms.github = {
          handle: spProfile.github_username,
          url: `https://github.com/${spProfile.github_username}`,
          verified: true,
          lastVerifiedAt: new Date()
        };
      }

      profile = await UserCoderProfile.create({
        userId: user.id,
        userEmail: user.email,
        platforms: initialPlatforms
      });
    }

    return NextResponse.json({
      success: true,
      platforms: profile.platforms || {},
      otherUrls: profile.otherUrls || [],
      lastSnapshotAt: profile.lastSnapshotAt
    });

  } catch (error: any) {
    console.error('Error fetching linked coder profiles:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { platforms, otherUrls } = body;

    if (!platforms && !otherUrls) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    await connectToDatabase();

    const updateData: any = {
      userEmail: user.email,
      updatedAt: new Date()
    };

    if (platforms) {
      if (platforms.leetcode !== undefined) {
        updateData['platforms.leetcode'] = platforms.leetcode;
      }
      if (platforms.github !== undefined) {
        updateData['platforms.github'] = platforms.github;
      }
      if (platforms.codeforces !== undefined) {
        updateData['platforms.codeforces'] = platforms.codeforces;
      }
    }
    
    if (otherUrls !== undefined && Array.isArray(otherUrls)) {
      updateData.otherUrls = otherUrls;
    }

    const updatedProfile = await UserCoderProfile.findOneAndUpdate(
      { userId: user.id },
      { $set: updateData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Sync URLs to Supabase user_profiles as well
    const supabaseUpdates: any = {};
    if (platforms.leetcode?.url) supabaseUpdates.leetcode_url = platforms.leetcode.url;
    if (platforms.codeforces?.url) supabaseUpdates.codeforces_url = platforms.codeforces.url;
    if (platforms.github?.handle) supabaseUpdates.github_username = platforms.github.handle;

    if (Object.keys(supabaseUpdates).length > 0) {
      await supabase
        .from('user_profiles')
        .update(supabaseUpdates)
        .eq('id', user.id);
    }

    return NextResponse.json({
      success: true,
      platforms: updatedProfile.platforms,
      otherUrls: updatedProfile.otherUrls
    });

  } catch (error: any) {
    console.error('Error saving linked coder profiles:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const platform = searchParams.get('platform');

    if (!platform || !['leetcode', 'github', 'codeforces'].includes(platform)) {
      return NextResponse.json({ success: false, error: 'Valid platform query parameter required' }, { status: 400 });
    }

    await connectToDatabase();

    await UserCoderProfile.updateOne(
      { userId: user.id },
      { $unset: { [`platforms.${platform}`]: "" } }
    );

    return NextResponse.json({
      success: true,
      message: `${platform} unlinked successfully.`
    });

  } catch (error: any) {
    console.error('Error unlinking platform:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
