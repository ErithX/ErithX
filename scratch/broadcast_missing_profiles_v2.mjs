import { createClient } from '@supabase/supabase-js';
import mongoose from 'mongoose';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;

function generateEmailHtml(firstName) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:24px 16px;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#18181b;line-height:1.6;font-size:15px;">
  <div style="max-width:540px;margin:0 auto;">
    <p style="margin:0 0 16px 0;">Hi ${firstName},</p>
    
    <p style="margin:0 0 16px 0;">You signed up for ErithX, but you haven't added your LeetCode, Codeforces, or GitHub handles yet.</p>
    
    <p style="margin:0 0 16px 0;">Without them, our system has no idea what problems you solved this week or where you're getting stuck. That means we can't send your weekly review or set your targets this Sunday.</p>
    
    <p style="margin:0 0 24px 0;">It takes literally 30 seconds — just paste your usernames (no passwords needed):</p>
    
    <p style="margin:0 0 28px 0;">
      <a href="https://erithx.dev/dashboard/settings" style="display:inline-block;background-color:#09090b;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600;font-size:14px;">
        Connect Your Profiles &rarr;
      </a>
    </p>
    
    <p style="margin:0 0 20px 0;">Or copy this link into your browser:<br>
      <a href="https://erithx.dev/dashboard/settings" style="color:#2563eb;word-break:break-all;font-size:13px;">https://erithx.dev/dashboard/settings</a>
    </p>
    
    <p style="margin:0 0 20px 0;">Let’s get you set up before Sunday.</p>
    
    <p style="margin:0;font-weight:600;color:#09090b;">Debjyoti</p>
    <p style="margin:2px 0 0 0;color:#71717a;font-size:13px;">ErithX</p>
  </div>
</body>
</html>
`;
}

function generateEmailText(firstName) {
  return `Hi ${firstName},

You signed up for ErithX, but you haven't added your LeetCode, Codeforces, or GitHub handles yet.

Without them, our system has no idea what problems you solved this week or where you're getting stuck. That means we can't send your weekly review or set your targets this Sunday.

It takes literally 30 seconds — just paste your usernames (no passwords needed):

Connect Your Profiles: https://erithx.dev/dashboard/settings

Let’s get you set up before Sunday.

Debjyoti
ErithX`;
}

async function main() {
  if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !MONGODB_URI) {
    console.error("Missing required environment variables.");
    process.exit(1);
  }

  const supa = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log("Connecting to MongoDB and Supabase...");
  await mongoose.connect(MONGODB_URI);

  // 1. Fetch coder profiles from MongoDB with at least 1 platform connected
  const UserCoderProfile = mongoose.model('UserCoderProfile', new mongoose.Schema({}, { strict: false }));
  const connectedInMongo = await UserCoderProfile.find({
    $or: [
      { 'platforms.leetcode.handle': { $exists: true, $nin: [null, ''] } },
      { 'platforms.codeforces.handle': { $exists: true, $nin: [null, ''] } },
      { 'platforms.github.handle': { $exists: true, $nin: [null, ''] } },
    ]
  }).lean();

  const mongoConnectedUserIds = new Set(connectedInMongo.map(c => c.userId));
  console.log(`Found ${mongoConnectedUserIds.size} users with active profiles in MongoDB.`);

  // 2. Fetch all registered users from Supabase
  const { data: supaUsers, error } = await supa
    .from('user_profiles')
    .select('id, email, full_name, username, leetcode_url, codeforces_url, github_username, account_status');

  if (error) {
    console.error("Error fetching Supabase users:", error);
    process.exit(1);
  }

  // 3. Filter strictly to users who have ZERO profiles connected
  const targetUsers = supaUsers.filter(u => {
    if (!u.email || !u.email.includes('@')) return false;
    if (u.account_status === 'suspended' || u.account_status === 'deleted') return false;
    
    // Skip if already has profiles in MongoDB
    if (mongoConnectedUserIds.has(u.id)) return false;

    // Skip if already has profiles in Supabase
    const hasLeetcode = u.leetcode_url && u.leetcode_url.trim() !== '';
    const hasCodeforces = u.codeforces_url && u.codeforces_url.trim() !== '';
    const hasGithub = u.github_username && u.github_username.trim() !== '';
    if (hasLeetcode || hasCodeforces || hasGithub) return false;

    return true;
  });

  console.log(`Targeting ${targetUsers.length} users with zero connected profiles.`);

  if (targetUsers.length === 0) {
    console.log("No users need profile reminder. Exiting.");
    await mongoose.disconnect();
    process.exit(0);
  }

  // 4. Build batch payload for Resend
  const payload = targetUsers.map(u => {
    const rawName = u.full_name || u.username || 'there';
    const firstName = rawName.trim().split(' ')[0] || 'there';
    return {
      from: 'Debjyoti from ErithX <founder@erithx.dev>',
      to: [u.email.trim()],
      subject: "We still can't track your progress.",
      text: generateEmailText(firstName),
      html: generateEmailHtml(firstName)
    };
  });

  // Batch in chunks of 50 to respect Resend limits
  const BATCH_SIZE = 50;
  let sentCount = 0;

  for (let i = 0; i < payload.length; i += BATCH_SIZE) {
    const chunk = payload.slice(i, i + BATCH_SIZE);
    console.log(`Dispatching batch ${Math.floor(i / BATCH_SIZE) + 1} (${chunk.length} emails)...`);

    const res = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chunk)
    });

    const resData = await res.json();
    if (!res.ok) {
      console.error(`Batch failed:`, resData);
    } else {
      sentCount += chunk.length;
      console.log(`Successfully sent batch of ${chunk.length} emails.`);
    }
  }

  console.log(`\n========================================`);
  console.log(`BROADCAST COMPLETE: Dispatched to ${sentCount} unconnected users.`);
  console.log(`========================================`);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error("Broadcast failed:", err);
  process.exit(1);
});
