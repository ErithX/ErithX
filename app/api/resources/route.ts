import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import { Resource } from '@/models/Resource';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all published documents
    // In a real app, you'd add pagination (skip, limit) here
    const publishedDocs = await Resource.find({ status: 'published' })
      .sort({ createdAt: -1 }) // Newest first
      .limit(50);
      
    return NextResponse.json(publishedDocs, { status: 200 });
  } catch (error: any) {
    console.error("Resources Fetch API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
