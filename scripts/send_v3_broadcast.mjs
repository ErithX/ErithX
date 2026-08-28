import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const HTML_CONTENT_TEMPLATE = (userName) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding:40px 40px 24px 40px; text-align: center;">
              <h2 style="margin:0;font-size:24px;color:#111827;font-weight:700;letter-spacing:-0.5px;">Erith<span style="color:#10b981;">X</span></h2>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 40px 40px;">
              <p style="margin:0 0 16px 0;font-size:16px;color:#374151;line-height:1.6;">
                Hi ${userName},
              </p>
              <p style="margin:0 0 16px 0;font-size:16px;color:#374151;line-height:1.6;">
                You knew us as DSA Quest, a simple contest tracker. But tracking contests isn't enough to guarantee real growth.
              </p>
              <p style="margin:0 0 24px 0;font-size:18px;color:#111827;line-height:1.6;font-weight:600;">
                We've evolved into ErithX.
              </p>
              <p style="margin:0 0 16px 0;font-size:16px;color:#374151;line-height:1.6;">
                ErithX is now your personal engineering mentor.
              </p>
              <p style="margin:0 0 24px 0;font-size:16px;color:#374151;line-height:1.6;">
                Every Sunday evening, we'll review your actual work across LeetCode, Codeforces, and GitHub. We'll send you a friendly, honest breakdown of your week to help you focus on what really matters—making real progress, not just staying busy.
              </p>
              
              <div style="background-color:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:24px; margin-bottom:32px;">
                <p style="margin:0 0 16px 0;font-size:14px;color:#10b981;line-height:1.6;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                  Action required to get started
                </p>
                <p style="margin:0 0 16px 0;font-size:15px;color:#4b5563;line-height:1.6;">
                  To prepare for your first weekly review, please connect your coding profiles:
                </p>
                <ol style="margin:0;padding-left:20px;font-size:15px;color:#4b5563;line-height:1.8;">
                  <li>Log in to your <a href="https://erithx.dev/dashboard" style="color:#10b981;text-decoration:none;font-weight:500;">dashboard</a></li>
                  <li>Navigate to <b>Settings &rarr; Coding Profiles</b></li>
                  <li>Connect your accounts</li>
                </ol>
              </div>

              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="https://erithx.dev/dashboard/settings" style="display:inline-block;padding:14px 28px;background-color:#10b981;color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;">Connect Profiles Now</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px 0;font-size:16px;color:#374151;line-height:1.6;">
                We look forward to helping you prepare with intent.
              </p>

              <p style="margin:0;font-size:15px;color:#6b7280;line-height:1.6;">
                Best regards,<br>
                <span style="color:#374151;font-weight:500;">The ErithX Team</span><br>
                <a href="https://erithx.dev" style="color:#10b981;text-decoration:none;">erithx.dev</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

async function main() {
  if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing RESEND_API_KEY or SUPABASE keys in your environment file.");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log("Connected to Supabase Production.");

  // Fetch all users from Supabase Auth
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error("Error fetching users from Supabase:", error);
    process.exit(1);
  }
  
  console.log(`Found ${users.length} raw users in Supabase.`);

  // Filter and keep unique emails
  const uniqueUsers = [];
  const seenEmails = new Set();
  
  for (const u of users) {
    if (u.email && !u.email.includes('example.com') && !u.email.includes('test.com') && !seenEmails.has(u.email)) {
      seenEmails.add(u.email);
      // Try to get name from raw_user_meta_data if Google OAuth was used
      const fullName = u.user_metadata?.full_name || u.user_metadata?.name || 'there';
      const firstName = fullName.split(' ')[0];
      uniqueUsers.push({ email: u.email, name: firstName });
    }
  }

  console.log(`Ready to send to ${uniqueUsers.length} real users.`);
  if (uniqueUsers.length === 0) {
    process.exit(0);
  }

  // Batching into chunks of 90
  const CHUNK_SIZE = 90;
  const chunks = [];
  for (let i = 0; i < uniqueUsers.length; i += CHUNK_SIZE) {
    chunks.push(uniqueUsers.slice(i, i + CHUNK_SIZE));
  }

  let totalSent = 0;
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`Sending batch ${i + 1}...`);
    
    const payload = chunk.map(u => ({
      from: 'ErithX <founder@erithx.dev>',
      to: [u.email],
      subject: 'A personal hello from ErithX 👋',
      html: HTML_CONTENT_TEMPLATE(u.name)
    }));

    try {
      const response = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (!response.ok) {
         console.error(`Batch ${i + 1} failed:`, data);
      } else {
         totalSent += chunk.length;
         console.log(`Success! Sent ${chunk.length} emails in this batch.`);
      }
    } catch (e) {
      console.error(`Failed to send batch ${i + 1}:`, e);
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\nBROADCAST COMPLETE! Successfully dispatched ${totalSent} emails via Resend.`);
  process.exit(0);
}

main().catch(console.error);
