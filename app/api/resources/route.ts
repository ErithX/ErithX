import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import { Resource } from '@/models/Resource';

export const revalidate = 300; // Cache this route's response for 5 minutes

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all published documents
    // In a real app, you'd add pagination (skip, limit) here
    const publishedDocs = await Resource.find({ status: 'published' })
      .sort({ createdAt: -1 }) // Newest first
      .limit(50);
      
    // Impression-based views: Increment views for all fetched documents
    const docIds = publishedDocs.map(doc => doc._id);
    if (docIds.length > 0) {
      // Execute without awaiting to not block the response
      Resource.updateMany(
        { _id: { $in: docIds } },
        { $inc: { views: 1 } }
      ).exec().catch(console.error);
    }
      
    return NextResponse.json(publishedDocs, { status: 200 });
  } catch (error: any) {
    console.error("Resources Fetch API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
