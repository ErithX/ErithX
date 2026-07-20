import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import connectToDatabase from '@/app/lib/mongodb';
import { Resource } from '@/models/Resource';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // SUPERADMIN Check
    const superAdmins = (process.env.NEXT_PUBLIC_SUPERADMIN_EMAILS || '').split(',').map(e => e.trim());
    if (!user || !superAdmins.includes(user.email || '')) {
      return NextResponse.json({ error: 'Forbidden. Superadmin only.' }, { status: 403 });
    }

    await connectToDatabase();

    const pendingDocs = await Resource.find({ status: 'pending' }).sort({ updatedAt: -1 });

    return NextResponse.json(pendingDocs, { status: 200 });
  } catch (error: any) {
    console.error("Admin API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
