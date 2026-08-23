import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import connectToDatabase from '@/app/lib/mongodb';
import AIReview from '@/models/AIReview';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { reviewId } = await req.json();
    if (!reviewId) {
      return NextResponse.json({ success: false, error: 'Review ID required' }, { status: 400 });
    }

    await connectToDatabase();

    const review = await AIReview.findOneAndUpdate(
      { _id: reviewId, user_id: user.id },
      { 
        $set: { 
          is_acknowledged: true,
          acknowledged_at: new Date()
        } 
      },
      { new: true }
    );

    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, is_acknowledged: review.is_acknowledged });

  } catch (error: any) {
    console.error('Error acknowledging review:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
