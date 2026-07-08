import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import { Resource } from '@/models/Resource';

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
