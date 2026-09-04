import { createClient } from '@supabase/supabase-js';

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
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:8px;border:1px solid #e5e7eb;overflow:hidden;box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding:32px;">
              <h2 style="margin:0;font-size:22px;color:#111827;font-weight:700;">Action Required: Missing Profiles</h2>
              <p style="margin:8px 0 24px 0;font-size:14px;color:#6b7280;line-height:24px;">Your ErithX profile is currently empty.</p>
              
              <p style="margin:0 0 16px 0;font-size:15px;color:#374151;line-height:24px;">Hi ${userName},</p>
              
              <p style="margin:0 0 16px 0;font-size:15px;color:#374151;line-height:24px;">
                You registered for ErithX, but you haven't linked your LeetCode, Codeforces, or other platform profiles yet.
              </p>
              
              <p style="margin:0 0 16px 0;font-size:15px;color:#374151;line-height:24px;">
                Our system cannot run your weekly performance delta, analyze your progress, or generate your career roadmap until we have data to process. We rely strictly on your actual coding behavior&mdash;not estimates.
              </p>

              <p style="margin:0 0 32px 0;font-size:15px;color:#374151;line-height:24px;">
                Take 30 seconds to connect your profiles now so our system can generate your first baseline performance review this Sunday.
              </p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center" style="background-color:#111827;border-radius:6px;">
                    <a href="https://erithx.dev/dashboard/settings" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">Connect My Profiles</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px 0;font-size:15px;color:#374151;line-height:24px;">
                <a href="https://erithx.dev/docs/performance-analysis" style="color:#10b981;text-decoration:underline;">See how it works?</a>
              </p>

              <p style="margin:0 0 4px 0;font-size:15px;color:#374151;line-height:24px;">Keep pushing forward.</p>
              <p style="margin:0 0 32px 0;font-size:15px;color:#374151;line-height:24px;font-weight:500;">&mdash; ErithX Team</p>
              
              <div style="border-top:1px solid #e5e7eb;padding-top:24px;">
                <p style="margin:8px 0 0 0;font-size:11px;color:#9ca3af;line-height:1.6;">ErithX &middot; Built for modern developers.</p>
              </div>
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
    console.error("Missing required environment variables.");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log("Connected to Supabase. Fetching users with missing profiles...");

  // Fetch users from user_profiles table who are missing both leetcode AND codeforces URLs
  const { data: missingUsers, error } = await supabase
    .from('user_profiles')
    .select('email, full_name, username')
    .or('leetcode_url.is.null,leetcode_url.eq.""')
    .or('codeforces_url.is.null,codeforces_url.eq.""');
  
  if (error) {
    console.error("Error fetching users from Supabase:", error);
    process.exit(1);
  }

  // Filter out users with missing emails just in case
  const validUsers = missingUsers.filter(u => u.email && u.email.trim() !== "");
  
  console.log(`Found ${validUsers.length} users with missing profiles.`);
  
  if (validUsers.length === 0) {
    console.log("No users to email. Exiting.");
    process.exit(0);
  }

  // Batch into chunks of 100 for Resend API limits
  const BATCH_SIZE = 100;
  for (let i = 0; i < validUsers.length; i += BATCH_SIZE) {
    const chunk = validUsers.slice(i, i + BATCH_SIZE);
    
    const payload = chunk.map(u => {
      const nameStr = u.full_name || u.username || 'there';
      const firstName = nameStr.split(' ')[0];
      return {
        from: 'ErithX Team <founder@erithx.dev>',
        to: [u.email],
        subject: 'We can\'t track what you don\'t connect.',
        html: HTML_CONTENT_TEMPLATE(firstName)
      };
    });

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
          console.error(`Batch ${i / BATCH_SIZE + 1} failed:`, data);
      } else {
          console.log(`Success! Sent batch ${i / BATCH_SIZE + 1} (${chunk.length} emails).`);
      }
    } catch (e) {
      console.error(`Failed to send batch ${i / BATCH_SIZE + 1}:`, e);
    }
  }

  console.log(`\\nBROADCAST COMPLETE!`);
  process.exit(0);
}

main().catch(console.error);
