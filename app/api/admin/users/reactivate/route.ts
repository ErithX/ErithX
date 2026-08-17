import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { sendReactivationApprovedEmail } from '@/app/lib/email/emailService';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    
    // Create supabase client to check if current user is admin
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          }
        }
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify Admin rights (You can adapt this to your actual admin check logic)
    const isAdmin = user.email === 'debjyoti.yoforex@gmail.com' || user.email === 'debjyoti2409@gmail.com';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Using Service Role to bypass RLS and update the target user
    const { createClient } = require('@supabase/supabase-js');
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

    // Get target user details for the email
    const { data: targetUser, error: fetchError } = await supabaseAdmin
      .from('user_profiles')
      .select('email, full_name, account_status')
      .eq('id', userId)
      .single();

    if (fetchError || !targetUser) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
    }

    if (targetUser.account_status !== 'pending_reactivation') {
      return NextResponse.json({ error: 'User is not pending reactivation' }, { status: 400 });
    }

    // Approve Reactivation
    const { error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        account_status: 'active',
        receive_review_emails: true,
        last_dashboard_visit: new Date().toISOString(),
        warning_email_sent: false,
        reactivation_reason: null
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Send confirmation email
    if (targetUser.email) {
      await sendReactivationApprovedEmail(
        targetUser.email, 
        targetUser.full_name?.split(' ')[0] || 'Coder'
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin Reactivate Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
