import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/app/lib/supabase/server';
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

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const adminEmails = (process.env.SUPERADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase());

    if (!user || !user.email || !adminEmails.includes(user.email.toLowerCase())) {
      console.log(`❌ Unauthorized email broadcast attempt by ${user?.email || 'unknown user'}`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { subject, body, recipients } = await request.json();

    if (!subject || !body || !recipients) {
      return NextResponse.json({ error: 'Missing subject, body, or recipients parameter' }, { status: 400 });
    }

    let targetEmails: string[] = [];

    if (recipients === 'all') {
      const { data: profiles, error } = await supabaseAdmin
        .from('user_profiles')
        .select('email');

      if (error) {
        console.error('❌ Database error fetching broadcast emails:', error);
        return NextResponse.json({ error: 'Failed to fetch user emails' }, { status: 500 });
      }
      targetEmails = profiles.map((p) => p.email).filter(Boolean);
    } else if (Array.isArray(recipients)) {
      targetEmails = recipients;
    } else {
      return NextResponse.json({ error: 'Invalid recipients format' }, { status: 400 });
    }

    if (targetEmails.length === 0) {
      return NextResponse.json({ success: true, message: 'No recipients found', sentCount: 0 });
    }

    console.log(`📧 Dispatching custom email manual broadcast to ${targetEmails.length} recipients...`);

    // Prepare modern HTML template for the email
    const generateHtmlTemplate = (messageContent: string, emailSubject: string) => {
      // Safely escape lines
      const paragraphs = messageContent
        .split('\n')
        .filter(p => p.trim().length > 0)
        .map(p => `<p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #374151;">${p}</p>`)
        .join('');

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${emailSubject}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: -0.5px;">🎯 DSA Quest</h1>
              <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0 0; font-size: 14px; font-weight: 500;">Official Announcement</p>
            </div>

            <!-- Content -->
            <div style="padding: 32px 24px;">
              <h2 style="color: #111827; font-size: 20px; margin: 0 0 20px 0; font-weight: bold; letter-spacing: -0.3px;">
                ${emailSubject}
              </h2>
              <div style="color: #374151;">
                ${paragraphs}
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f9fafb; padding: 24px 20px; text-align: center; border-top: 1px solid #f3f4f6; color: #9ca3af; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0 0 12px 0;">
                You are receiving this announcement because you are a registered user of DSA Quest.
              </p>
              <div style="margin-bottom: 16px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
                   style="display: inline-block; background: #10b981; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 12px;">
                  Go to Dashboard
                </a>
              </div>
              <p style="margin: 0; font-size: 11px; color: #d1d5db;">
                &copy; 2026 DSA Quest. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    };

    // Send emails in a loop and collect results
    const results = [];
    let sentCount = 0;
    let failedCount = 0;

    for (const email of targetEmails) {
      try {
        const htmlContent = generateHtmlTemplate(body, subject);
        const emailResult = await sendEmail({ to: email, subject, html: htmlContent });

        if (emailResult.success) {
          sentCount++;
          results.push({ email, success: true });
        } else {
          failedCount++;
          results.push({ email, success: false, error: 'SMTP send failure' });
        }
      } catch (err: any) {
        failedCount++;
        results.push({ email, success: false, error: err.message || err });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully sent ${sentCount} email(s). Failed to send ${failedCount} email(s).`,
      sentCount,
      failedCount,
      results,
    });
  } catch (error: any) {
    console.error('❌ POST send-email API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
