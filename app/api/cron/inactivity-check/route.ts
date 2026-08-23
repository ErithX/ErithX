import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendInactivityWarningEmail } from '@/app/lib/email/emailService';

export const maxDuration = 60; // 60s max execution time
export const dynamic = 'force-dynamic';

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

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const day12Threshold = new Date(now.getTime() - (12 * 24 * 60 * 60 * 1000)).toISOString();
    const day14Threshold = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000)).toISOString();

    // Find users who need Day 12 warnings (last visit > 12 days, active, warning_email_sent == false)
    const { data: usersToWarn, error: warnError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, full_name')
      .eq('account_status', 'active')
      .eq('warning_email_sent', false)
      .lt('last_dashboard_visit', day12Threshold)
      .gt('last_dashboard_visit', day14Threshold); // Don't warn if already past 14 days

    if (warnError) throw new Error(warnError.message);

    let warnedCount = 0;
    if (usersToWarn && usersToWarn.length > 0) {
      for (const user of usersToWarn) {
        if (!user.email) continue;
        
        try {
          await sendInactivityWarningEmail(user.email, user.full_name?.split(' ')[0] || 'Coder');
          await supabaseAdmin
            .from('user_profiles')
            .update({ warning_email_sent: true })
            .eq('id', user.id);
          warnedCount++;
        } catch (e) {
          console.error(`Failed to send warning to ${user.email}:`, e);
        }
      }
    }

    // Find users who need Day 14 suspensions (last visit > 14 days, active)
    const { data: usersToSuspend, error: suspendError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email')
      .eq('account_status', 'active')
      .lt('last_dashboard_visit', day14Threshold);

    if (suspendError) throw new Error(suspendError.message);

    let suspendedCount = 0;
    if (usersToSuspend && usersToSuspend.length > 0) {
      for (const user of usersToSuspend) {
        try {
          await supabaseAdmin
            .from('user_profiles')
            .update({ 
              account_status: 'suspended',
              receive_review_emails: false 
            })
            .eq('id', user.id);
          suspendedCount++;
        } catch (e) {
          console.error(`Failed to suspend ${user.email}:`, e);
        }
      }
    }

    return NextResponse.json({
      success: true,
      warned: warnedCount,
      suspended: suspendedCount
    });

  } catch (error: any) {
    console.error('Inactivity Check Cron Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
