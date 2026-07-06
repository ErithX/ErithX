import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import connectToDatabase from '@/app/lib/mongodb';
import { Resource } from '@/models/Resource';

// Create a new blank draft document
export async function POST(req: NextRequest) {
  try {
    const supabaseClient = await createClient();
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const newDraft = await Resource.create({
      userId: user.id,
      status: 'draft',
      title: '',
      content: ''
    });

    return NextResponse.json(newDraft, { status: 201 });
  } catch (error: any) {
    console.error("Create Document API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
