import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import { Resource } from '@/models/Resource';
import { createClient } from '@supabase/supabase-js';

// Setup admin client for trusted auth checks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    await dbConnect();
    const resource = await Resource.findById(id);

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    const userId = user.id;
    const hasUpvoted = resource.upvotedBy.includes(userId);

    if (hasUpvoted) {
      // Remove upvote
      resource.upvotedBy = resource.upvotedBy.filter((uid: string) => uid !== userId);
      resource.upvotes = Math.max(0, resource.upvotes - 1);
    } else {
      // Add upvote
      resource.upvotedBy.push(userId);
      resource.upvotes += 1;
    }

    await resource.save();

    return NextResponse.json({ 
      upvotes: resource.upvotes, 
      hasUpvoted: !hasUpvoted 
    });

  } catch (error: any) {
    console.error("PUT /api/resources/[id]/upvote error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
