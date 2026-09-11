import { createClient } from '@supabase/supabase-js';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export const MISSING_PROFILES_V2_HTML = (userName = 'Developer') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ErithX Roadmap is on Hold</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;border:1px solid #e4e4e7;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.03);">
          
          <!-- Accent Top Bar -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg, #10b981 0%, #059669 50%, #047857 100%);"></td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding:36px 32px 32px 32px;">
              
              <!-- Tag / Pill -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="background-color:#ecfdf5;border:1px solid #a7f3d0;border-radius:20px;padding:4px 12px;">
                    <span style="font-size:11px;font-weight:600;color:#047857;letter-spacing:0.5px;text-transform:uppercase;">Follow-up &middot; Weekly Cycle Sync</span>
                  </td>
                </tr>
              </table>

              <!-- Main Heading -->
              <h1 style="margin:0 0 12px 0;font-size:22px;line-height:28px;color:#09090b;font-weight:700;letter-spacing:-0.4px;">
                Your AI Performance Review is on hold.
              </h1>
              
              <p style="margin:0 0 20px 0;font-size:14px;color:#71717a;line-height:22px;">
                We noticed your coding profiles aren't connected yet.
              </p>

              <!-- Salutation -->
              <p style="margin:0 0 16px 0;font-size:15px;color:#27272a;line-height:24px;">
                Hi ${userName},
              </p>

              <!-- Problem Narrative -->
              <p style="margin:0 0 16px 0;font-size:15px;color:#3f3f46;line-height:24px;">
                Every Sunday at 9:00 PM, ErithX runs an autonomous engineering audit for developers. Rather than asking you to fill out questionnaires, our engine calculates your real 7-day delta across <strong>LeetCode</strong>, <strong>Codeforces</strong>, and <strong>GitHub</strong>.
              </p>

              <p style="margin:0 0 24px 0;font-size:15px;color:#3f3f46;line-height:24px;">
                Because your handles haven't been linked to your account, our analyzer cannot verify your problem-solving momentum or calibrate your personalized roadmap targets.
              </p>

              <!-- Feature Highlight Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;border:1px solid #f4f4f5;border-radius:8px;padding:16px;margin-bottom:28px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px 0;font-size:12px;font-weight:700;color:#09090b;text-transform:uppercase;letter-spacing:0.5px;">What unlocks once you connect:</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#52525b;line-height:20px;">
                          &bull; <strong>7-Day Velocity Delta:</strong> Total Easy/Medium/Hard problems solved vs. last week.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#52525b;line-height:20px;">
                          &bull; <strong>Plateau Diagnosis:</strong> Honest feedback on rating stagnation and topic weaknesses.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#52525b;line-height:20px;">
                          &bull; <strong>Prescribed Targets:</strong> Specific focus areas for the upcoming sprint.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Call To Action Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:28px;width:100%;">
                <tr>
                  <td align="center">
                    <a href="https://erithx.dev/dashboard/settings" target="_blank" style="display:inline-block;width:100%;max-width:320px;padding:13px 24px;background-color:#09090b;color:#ffffff;text-align:center;font-size:14px;font-weight:600;border-radius:8px;text-decoration:none;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                      Link My Profiles (30s) &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px 0;font-size:12px;color:#a1a1aa;text-align:center;line-height:18px;">
                No passwords needed &mdash; only your public handles or profile URLs.
              </p>

              <hr style="border:none;border-top:1px solid #f4f4f5;margin:24px 0;" />

              <!-- Sign-off -->
              <p style="margin:0 0 4px 0;font-size:14px;color:#3f3f46;line-height:22px;">Stay relentless,</p>
              <p style="margin:0;font-size:14px;font-weight:600;color:#09090b;">Debjyoti Roy</p>
              <p style="margin:2px 0 0 0;font-size:12px;color:#71717a;">Founder &middot; ErithX</p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#fafafa;padding:20px 32px;border-top:1px solid #f4f4f5;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:11px;color:#a1a1aa;line-height:16px;">
                    ErithX &middot; Zero-noise placement prep &amp; performance telemetry.
                  </td>
                  <td align="right" style="font-size:11px;color:#71717a;">
                    <a href="https://erithx.dev/dashboard/settings" style="color:#71717a;text-decoration:underline;">Settings</a>
                    &nbsp;&middot;&nbsp;
                    <a href="https://erithx.dev/docs/performance-analysis" style="color:#71717a;text-decoration:underline;">Documentation</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

async function run() {
  if (!RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY in environment.");
    process.exit(1);
  }

  const recipientEmail = 'debjyoti2409@gmail.com';
  const recipientName = 'Debjyoti';

  console.log(`Sending Follow-Up (V2) Test Email to ${recipientEmail}...`);

  const payload = {
    from: 'Debjyoti from ErithX <founder@erithx.dev>',
    to: [recipientEmail],
    subject: 'Your weekly performance review is on hold (Connect handles)',
    html: MISSING_PROFILES_V2_HTML(recipientName)
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Resend API Error:", data);
  } else {
    console.log("Email successfully sent via Resend! ID:", data.id);
  }
}

run().catch(console.error);
