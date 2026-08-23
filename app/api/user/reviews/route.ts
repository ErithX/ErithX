import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import connectToDatabase from '@/app/lib/mongodb';
import AIReview from '@/models/AIReview';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get('id');
    const dateParam = searchParams.get('date');

    // 1. Fetch single review by MongoDB _id
    if (reviewId && mongoose.Types.ObjectId.isValid(reviewId)) {
      const review = await AIReview.findOne({
        _id: reviewId,
        user_id: user.id,
      }).lean();

      if (!review) {
        return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, review });
    }

    // 2. Fetch single review by specific date (YYYY-MM-DD)
    if (dateParam) {
      const start = new Date(dateParam);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(dateParam);
      end.setUTCHours(23, 59, 59, 999);

      const review = await AIReview.findOne({
        user_id: user.id,
        $or: [
          { week_start_date: { $gte: start, $lte: end } },
          { created_at: { $gte: start, $lte: end } },
        ],
      })
        .sort({ created_at: -1 })
        .lean();

      if (!review) {
        return NextResponse.json({ success: false, error: `Report for date ${dateParam} not found` }, { status: 404 });
      }

      return NextResponse.json({ success: true, review });
    }

    // 3. Return full chronological report list (for timeline & selector)
    const reviews = await AIReview.find({ user_id: user.id })
      .sort({ created_at: -1 })
      .limit(30)
      .lean();

    return NextResponse.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error: any) {
    console.error('Error fetching user reviews:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
