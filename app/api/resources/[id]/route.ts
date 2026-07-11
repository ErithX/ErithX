import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import { Resource } from '@/models/Resource';
import { createClient } from '@/app/lib/supabase/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const id = (await params).id;
    
    // Fetch a single published document
    const doc = await Resource.findOne({ _id: id, status: 'published' });
    
    if (!doc) {
      return NextResponse.json({ error: 'Resource not found or not published' }, { status: 404 });
    }
      
    return NextResponse.json(doc, { status: 200 });
  } catch (error: any) {
    console.error("Single Resource Fetch API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabaseClient = await createClient();
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const id = (await params).id;
    
    // Ensure the resource belongs to the user
    const result = await Resource.deleteOne({ _id: id, userId: user.id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Resource not found or unauthorized' }, { status: 404 });
    }
      
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Resource DELETE API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
