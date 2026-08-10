import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import { PlatformMetric } from '@/models/PlatformMetric';
import { Resource } from '@/models/Resource';
import { UserActivity } from '@/models/UserActivity';
import { createClient } from '@/app/lib/supabase/server';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, platform, resourceId, title } = body;

    if (!type) {
      return NextResponse.json({ error: 'Missing metric type' }, { status: 400 });
    }

    await connectToDatabase();

    // Determine current user if authenticated
    let userId: string | null = null;
    let userEmail = 'Guest User';
    let userName = 'Guest Coder';
    let userAvatar = '';

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
        userEmail = user.email || 'Registered User';
        userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Coder';
        userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';
      }
    } catch {
      // Unauthenticated session, fallback to guest
    }

    // 1. If PDF download, increment resource specific download count & get title
    let activityTitle = title || '';
    if (type === 'pdf_download' && resourceId) {
      const query = mongoose.Types.ObjectId.isValid(resourceId)
        ? { _id: resourceId }
        : { slug: resourceId };

      const updatedDoc = await Resource.findOneAndUpdate(
        query, 
        { $inc: { pdfDownloads: 1 } },
        { new: true, select: 'title' }
      );
      if (updatedDoc && !activityTitle) {
        activityTitle = updatedDoc.title;
      }
    }

    // 2. Normalize platform name
    let sanitizedPlatform = (platform || 'General').trim();
    if (sanitizedPlatform.toLowerCase().includes('leetcode')) sanitizedPlatform = 'LeetCode';
    else if (sanitizedPlatform.toLowerCase().includes('codeforces')) sanitizedPlatform = 'Codeforces';
    else if (sanitizedPlatform.toLowerCase().includes('codechef')) sanitizedPlatform = 'CodeChef';
    else if (sanitizedPlatform.toLowerCase().includes('geeksforgeeks') || sanitizedPlatform.toLowerCase().includes('gfg')) sanitizedPlatform = 'GeeksforGeeks';
    else if (sanitizedPlatform.toLowerCase().includes('atcoder')) sanitizedPlatform = 'AtCoder';
    else if (sanitizedPlatform.toLowerCase().includes('hackerearth')) sanitizedPlatform = 'HackerEarth';
    else if (sanitizedPlatform.toLowerCase().includes('hackerrank')) sanitizedPlatform = 'HackerRank';
    else sanitizedPlatform = sanitizedPlatform.replace(/\./g, '_');

    // 3. Increment global aggregate metrics in PlatformMetric
    const updateObj: any = { 
      $inc: { 
        count: 1,
        [`platformBreakdown.${sanitizedPlatform}`]: 1
      } 
    };

    await PlatformMetric.findOneAndUpdate(
      { metricKey: type },
      updateObj,
      { upsert: true, returnDocument: 'after' }
    );

    // 4. Record granular user activity log
    await UserActivity.create({
      userId,
      userEmail,
      userName,
      userAvatar,
      type,
      title: activityTitle || sanitizedPlatform,
      platform: sanitizedPlatform,
      resourceId: resourceId || ''
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
