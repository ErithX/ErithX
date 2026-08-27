import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(MONGODB_URI);
}

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model('User', userSchema);

const HTML_CONTENT_TEMPLATE = (userName) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#08080a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#08080a;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#09090b;border-radius:12px;border:1px solid rgba(255,255,255,0.05);overflow:hidden;box-shadow: 0 0 40px rgba(0,0,0,0.5);">
          <tr>
            <td style="padding:40px 40px 24px 40px; text-align: center;">
              <img src="https://erithx.dev/newLogo.png" alt="ErithX" style="height:28px; width:auto; display:inline-block;">
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 40px 40px;">
              <p style="margin:0 0 16px 0;font-size:16px;color:#d4d4d8;line-height:1.6;">
                Hi ${userName},
              </p>
              <p style="margin:0 0 16px 0;font-size:16px;color:#d4d4d8;line-height:1.6;">
                You knew us as DSA Quest, a simple contest tracker. But tracking contests isn't enough to guarantee real growth.
              </p>
              <p style="margin:0 0 24px 0;font-size:18px;color:#ffffff;line-height:1.6;font-weight:600;">
                We've evolved into ErithX.
              </p>
              <p style="margin:0 0 16px 0;font-size:16px;color:#d4d4d8;line-height:1.6;">
                ErithX is now your personal engineering mentor.
              </p>
              <p style="margin:0 0 24px 0;font-size:16px;color:#d4d4d8;line-height:1.6;">
                Every Sunday evening, we'll review your actual work across LeetCode, Codeforces, and GitHub. We'll send you a friendly, honest breakdown of your week to help you focus on what really matters—making real progress, not just staying busy.
              </p>
              
              <div style="background-color:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:24px; margin-bottom:32px;">
                <p style="margin:0 0 16px 0;font-size:14px;color:#10b981;line-height:1.6;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                  Action required to get started
                </p>
                <p style="margin:0 0 16px 0;font-size:15px;color:#a1a1aa;line-height:1.6;">
                  To prepare for your first weekly review, please connect your coding profiles:
                </p>
                <ol style="margin:0;padding-left:20px;font-size:15px;color:#a1a1aa;line-height:1.8;">
                  <li>Log in to your <a href="https://erithx.dev/dashboard" style="color:#10b981;text-decoration:none;">dashboard</a></li>
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

              <p style="margin:0 0 24px 0;font-size:16px;color:#d4d4d8;line-height:1.6;">
                We look forward to helping you prepare with intent.
              </p>

              <p style="margin:0;font-size:15px;color:#a1a1aa;line-height:1.6;">
                Best regards,<br>
                <span style="color:#d4d4d8;">The ErithX Team</span><br>
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
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY");
    process.exit(1);
  }

  await connectToDatabase();
  console.log("Connected to MongoDB.");

  // Fetch all users with email
  const users = await User.find({ email: { $exists: true, $ne: null } }, 'email name').lean();
  console.log(`Found ${users.length} users with email.`);

  if (users.length === 0) {
    console.log("No users found. Exiting.");
    process.exit(0);
  }

  // Deduplicate by email just in case
  const uniqueUsers = [];
  const seenEmails = new Set();
  for (const u of users) {
    if (!seenEmails.has(u.email)) {
      seenEmails.add(u.email);
      uniqueUsers.push(u);
    }
  }
  
  console.log(`Unique users to email: ${uniqueUsers.length}`);

  // Batching into chunks of 90 (Resend limit is 100)
  const CHUNK_SIZE = 90;
  const chunks = [];
  for (let i = 0; i < uniqueUsers.length; i += CHUNK_SIZE) {
    chunks.push(uniqueUsers.slice(i, i + CHUNK_SIZE));
  }

  console.log(`Sending in ${chunks.length} batches...`);

  let totalSent = 0;
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`Sending batch ${i + 1}/${chunks.length} (${chunk.length} emails)...`);
    
    const payload = chunk
      .filter(u => u.email && !u.email.includes('example.com') && !u.email.includes('test.com'))
      .map(u => ({
        from: 'ErithX <founder@erithx.dev>',
        to: [u.email],
        subject: 'Welcome to the new ErithX',
        html: HTML_CONTENT_TEMPLATE(u.name || 'there')
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
      }
    } catch (e) {
      console.error(`Failed to send batch ${i + 1}:`, e);
    }
    
    // Sleep for 1 second between chunks
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\nBROADCAST COMPLETE! Sent ${totalSent} emails.`);
  process.exit(0);
}

main().catch(console.error);
