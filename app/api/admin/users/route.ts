import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/app/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function GET() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const adminEmails = (process.env.SUPERADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase());

    if (!user || !user.email || !adminEmails.includes(user.email.toLowerCase())) {
      console.log(`❌ Unauthorized admin access attempt by ${user?.email || 'unknown user'}`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Retrieve all user profiles from user_profiles table
    const { data: profiles, error } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, full_name, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Database error fetching user profiles:', error);
      return NextResponse.json({ error: 'Failed to fetch user profiles' }, { status: 500 });
    }

    return NextResponse.json({ success: true, users: profiles });
  } catch (error: any) {
    console.error('❌ GET users API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
