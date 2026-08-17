import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import connectToDatabase from '@/app/lib/mongodb';
import AIReview from '@/models/AIReview';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const latestReview = await AIReview.findOne({ user_id: user.id })
      .sort({ created_at: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      review: latestReview || null,
    });
  } catch (error: any) {
    console.error('Error fetching latest review:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
