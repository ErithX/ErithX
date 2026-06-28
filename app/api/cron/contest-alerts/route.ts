import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/app/lib/email/emailService';

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

interface Contest {
  id: string;
  platform: string;
  title: string;
  url: string;
  start_time: string;
  duration: number;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function buildAlertEmail(contest: Contest, minutesBefore: number, appUrl: string) {
  const durationHours = Math.floor(contest.duration / 3600);
  const durationMins = Math.floor((contest.duration % 3600) / 60);
  const durationStr = durationHours > 0
    ? `${durationHours}h ${durationMins > 0 ? durationMins + 'm' : ''}`
    : `${durationMins}m`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contest Reminder: ${contest.title}</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#222222;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e0e0e0;border-radius:4px;">

          <!-- Header -->
          <tr>
            <td style="padding:24px 32px;border-bottom:1px solid #e0e0e0;">
              <p style="margin:0;font-size:13px;color:#888888;letter-spacing:0.04em;text-transform:uppercase;">Contest Tracker</p>
              <h1 style="margin:8px 0 0 0;font-size:20px;font-weight:700;color:#111111;">Contest Reminder</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:#333333;">
                This is a reminder that the following contest begins in <strong>${minutesBefore} minutes</strong>.
              </p>

              <!-- Contest details box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f7f7;border-left:3px solid #222222;border-radius:2px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 6px 0;font-size:17px;font-weight:700;color:#111111;">${contest.title}</p>
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
                      <tr>
                        <td style="padding:3px 0;font-size:13px;color:#555555;width:90px;">Platform</td>
                        <td style="padding:3px 0;font-size:13px;color:#222222;font-weight:600;">${contest.platform}</td>
                      </tr>
                      <tr>
                        <td style="padding:3px 0;font-size:13px;color:#555555;">Start time</td>
                        <td style="padding:3px 0;font-size:13px;color:#222222;font-weight:600;">${formatDate(contest.start_time)} at ${formatTime(contest.start_time)}</td>
                      </tr>
                      <tr>
                        <td style="padding:3px 0;font-size:13px;color:#555555;">Duration</td>
                        <td style="padding:3px 0;font-size:13px;color:#222222;font-weight:600;">${durationStr}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:#111111;border-radius:3px;">
                    <a href="${contest.url}" target="_blank" style="display:inline-block;padding:11px 24px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.02em;">View Contest</a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0 0;font-size:13px;color:#888888;line-height:1.6;">
                You are receiving this email because you enabled contest alerts on
                <a href="${appUrl}" style="color:#222222;text-decoration:underline;">${appUrl.replace(/https?:\/\//, '')}</a>.
                To manage your alert preferences, visit your
                <a href="${appUrl}/dashboard" style="color:#222222;text-decoration:underline;">dashboard</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px 20px;border-top:1px solid #e0e0e0;">
              <p style="margin:0;font-size:12px;color:#aaaaaa;line-height:1.6;">
                If this email landed in your spam folder, please mark it as "Not Spam" so future
                reminders reach your inbox. You can also add <strong>${process.env.SMTP_USER || 'noreply@contesttracker.app'}</strong> to your contacts.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const url = new URL(request.url);
    const querySecret = url.searchParams.get('secret');
    const expectedSecret = process.env.CRON_SECRET;

    const isAuthorized =
      authHeader === `Bearer ${expectedSecret}` ||
      (querySecret && querySecret === expectedSecret);

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const contestsResponse = await fetch(`${appUrl}/api/contests`, { cache: 'no-store' });

    if (!contestsResponse.ok) {
      throw new Error('Failed to fetch contests');
    }

    const contestsData = await contestsResponse.json();
    if (!contestsData.success || !Array.isArray(contestsData.contests)) {
      throw new Error('Invalid contest response');
    }

    const contests: Contest[] = contestsData.contests;
    const now = new Date();

    const MINUTES_BEFORE = 30; // send alerts 30 minutes before every contest

    const { data: users, error: usersError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, full_name')
      .eq('email_notifications', true);

    if (usersError) {
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ success: true, message: 'No users to alert', alerts: 0 });
    }

    const windowStart = new Date(now.getTime() + (MINUTES_BEFORE - 3) * 60 * 1000);
    const windowEnd   = new Date(now.getTime() + (MINUTES_BEFORE + 3) * 60 * 1000);

    const matchingContests = contests.filter((contest) => {
      const startTime = new Date(contest.start_time);
      return startTime >= windowStart && startTime <= windowEnd;
    });

    if (matchingContests.length === 0) {
      return NextResponse.json({ success: true, message: 'No contests in alert window', alerts: 0 });
    }


    let sent = 0;
    let failed = 0;
    let skipped = 0;

    for (const user of users) {
      for (const contest of matchingContests) {
        // Skip if this user already received an alert for this contest
        const { data: existing, error: existingError } = await supabaseAdmin
          .from('contest_alerts')
          .select('id')
          .eq('user_id', user.id)
          .eq('contest_id', contest.id)
          .single();

        if (existingError && existingError.code !== 'PGRST116') {
          console.error('Error checking alert history:', existingError);
        }

        if (existing?.id) {
          skipped++;
          continue;
        }

        const subject = `Contest Reminder: ${contest.title} starts in ${MINUTES_BEFORE} minutes`;
        const html = buildAlertEmail(contest, MINUTES_BEFORE, appUrl);
        const result = await sendEmail({ to: user.email, subject, html });

        if (result.success) {
          sent++;
          await supabaseAdmin.from('contest_alerts').insert({
            user_id: user.id,
            contest_id: contest.id,
            contest_name: contest.title,
            contest_platform: contest.platform,
            start_time: contest.start_time,
            alert_minutes_before: MINUTES_BEFORE,
            status: 'sent',
            sent_at: new Date().toISOString(),
          });
        } else {
          failed++;
          await supabaseAdmin.from('contest_alerts').insert({
            user_id: user.id,
            contest_id: contest.id,
            contest_name: contest.title,
            contest_platform: contest.platform,
            start_time: contest.start_time,
            alert_minutes_before: MINUTES_BEFORE,
            status: 'failed',
            error_message: JSON.stringify(result.error),
            sent_at: new Date().toISOString(),
          });
        }
      }
    }


    return NextResponse.json({ success: true, sent, failed, skipped });
  } catch (error: any) {
    console.error('Contest alert cron error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
