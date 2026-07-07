import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import connectToDatabase from '@/app/lib/mongodb';
import { Resource } from '@/models/Resource';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // SUPERADMIN Check
    const superAdmins = (process.env.SUPERADMIN_EMAILS || '').split(',').map(e => e.trim());
    if (!user || !superAdmins.includes(user.email || '')) {
      return NextResponse.json({ error: 'Forbidden. Superadmin only.' }, { status: 403 });
    }

    await connectToDatabase();
    
    // In Next 15, we await params
    const id = (await params).id;
    const body = await req.json();

    // Body should contain { status: 'published' | 'rejected', rejectionReason?: string }
    const { status, rejectionReason } = body;

    if (!['published', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedDoc = await Resource.findByIdAndUpdate(
      id,
      { 
        $set: { 
          status, 
          rejectionReason: status === 'rejected' ? rejectionReason : '' 
        } 
      },
      { returnDocument: 'after' }
    );

    if (!updatedDoc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json(updatedDoc, { status: 200 });
  } catch (error: any) {
    console.error("Admin Action API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
