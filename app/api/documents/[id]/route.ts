import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import connectToDatabase from '@/app/lib/mongodb';
import { Resource } from '@/models/Resource';

// Update a document (Auto-save / Publish)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabaseClient = await createClient();
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // We must await params in Next.js 15
    const id = (await params).id;

    // Verify ownership
    const existingDoc = await Resource.findById(id);
    if (!existingDoc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (existingDoc.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();

    const updatedDoc = await Resource.findByIdAndUpdate(
      id,
      { $set: body },
      { returnDocument: 'after' }
    );

    return NextResponse.json(updatedDoc, { status: 200 });
  } catch (error: any) {
    console.error("Update Document API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
