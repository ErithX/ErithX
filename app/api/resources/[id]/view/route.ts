import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import { Resource } from '@/models/Resource';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const id = (await params).id;
    
    // Increment realViews by 1
    const result = await Resource.updateOne(
      { _id: id, status: 'published' },
      { $inc: { realViews: 1 } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Resource not found or not published' }, { status: 404 });
    }
      
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Resource View API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
