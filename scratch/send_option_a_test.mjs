const RESEND_API_KEY = process.env.RESEND_API_KEY;

const recipientEmail = 'debjyoti2409@gmail.com';
const recipientName = 'Debjyoti';

const plainTextContent = `Hi ${recipientName},

You signed up for ErithX, but you haven't added your LeetCode, Codeforces, or GitHub handles yet.

Without them, our system has no idea what problems you solved this week or where you're getting stuck. That means we can't send your weekly review or set your targets this Sunday.

It takes literally 30 seconds — just paste your usernames (no passwords needed):

Connect Your Profiles: https://erithx.dev/dashboard/settings

Let’s get you set up before Sunday.

Debjyoti
ErithX`;

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:24px 16px;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#18181b;line-height:1.6;font-size:15px;">
  <div style="max-width:540px;margin:0 auto;">
    <p style="margin:0 0 16px 0;">Hi ${recipientName},</p>
    
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

async function main() {
  if (!RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY in environment.");
    process.exit(1);
  }

  console.log(`Sending Option A email to ${recipientEmail}...`);

  const payload = {
    from: 'Debjyoti from ErithX <founder@erithx.dev>',
    to: [recipientEmail],
    subject: "We still can't track your progress.",
    text: plainTextContent,
    html: htmlContent
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
    console.error("Resend Error:", data);
  } else {
    console.log("Success! Email sent. ID:", data.id);
  }
}

main().catch(console.error);
