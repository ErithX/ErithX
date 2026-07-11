import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import { Resource } from '@/models/Resource';
import { createClient } from '@/app/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabaseClient = await createClient();
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const url = new URL(req.url);
    const statusParam = url.searchParams.get('status');
    
    const query: any = { userId: user.id };
    
    if (statusParam) {
      const statuses = statusParam.split(',');
      query.status = { $in: statuses };
    }

    const docs = await Resource.find(query)
      .sort({ updatedAt: -1 })
      .limit(50); // Just in case, to prevent massive payloads

    return NextResponse.json(docs, { status: 200 });
  } catch (error: any) {
    console.error("Resources Fetch API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
