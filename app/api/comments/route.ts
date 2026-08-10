import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Comment from '@/models/Comment';
import { Resource } from '@/models/Resource';
import { createClient } from '@supabase/supabase-js';

// Setup admin client for trusted auth checks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get('resourceId');

    if (!resourceId) {
      return NextResponse.json({ error: 'resourceId is required' }, { status: 400 });
    }

    await dbConnect();
    const mongoose = require('mongoose');
    let targetResourceId = resourceId;

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      const doc = await Resource.findOne({ slug: resourceId });
      if (doc) targetResourceId = doc._id.toString();
    }

    const comments = await Comment.find({ 
      $or: [{ resourceId: targetResourceId }, { resourceId: resourceId }] 
    }).sort({ createdAt: -1 });

    return NextResponse.json(comments);
  } catch (error: any) {
    console.error("GET /api/comments error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { resourceId, content } = body;

    if (!resourceId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();
    const mongoose = require('mongoose');

    // Polymorphic lookup to find target resource
    const query = mongoose.Types.ObjectId.isValid(resourceId) 
      ? { _id: resourceId } 
      : { slug: resourceId };

    const resourceDoc = await Resource.findOne(query);
    const targetDocId = resourceDoc ? resourceDoc._id.toString() : resourceId;

    // Create the comment
    const newComment = await Comment.create({
      resourceId: targetDocId,
      userId: user.id,
      authorName: user.user_metadata?.full_name || 'Anonymous',
      authorImg: user.user_metadata?.avatar_url || '',
      content
    });

    // Increment commentsCount on the resource
    if (resourceDoc) {
      resourceDoc.commentsCount = (resourceDoc.commentsCount || 0) + 1;
      await resourceDoc.save();
    }

    return NextResponse.json(newComment);
  } catch (error: any) {
    console.error("POST /api/comments error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

