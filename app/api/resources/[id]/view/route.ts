import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import { Resource } from '@/models/Resource';
import mongoose from 'mongoose';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const id = (await params).id;
    
    // Support lookup by either MongoDB _id or string slug
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id, status: 'published' }
      : { slug: id, status: 'published' };

    // Increment both views (general impressions) and realViews (direct reads)
    const result = await Resource.updateOne(
      query,
      { $inc: { views: 1, realViews: 1 } }
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

