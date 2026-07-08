import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import connectToDatabase from '@/app/lib/mongodb';
import { Resource } from '@/models/Resource';

// Get or create a draft document
export async function GET(req: NextRequest) {
  try {
    const supabaseClient = await createClient();
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Find the most recent draft for this user
    let draft = await Resource.findOne({ userId: user.id, status: 'draft' }).sort({ updatedAt: -1 });

    if (!draft) {
      // Extract name from user metadata (Google OAuth or manual signup)
      const authorName = user.user_metadata?.full_name || user.user_metadata?.name || 'Anonymous';
      const authorEmail = user.email || '';
      const authorImg = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';

      draft = await Resource.create({
        userId: user.id,
        authorName,
        authorEmail,
        authorImg,
        status: 'draft',
        title: '',
        content: ''
      });
    }

    return NextResponse.json(draft, { status: 200 });
  } catch (error: any) {
    console.error("Draft API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
