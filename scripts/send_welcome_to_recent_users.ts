import { sendWelcomeEmail } from '../app/lib/email/emailService';
import { getSupabaseAdminClient } from '../app/lib/superadmin';

const TARGET_USERS = [
  {
    id: '4aca62b5-faa5-430d-96b0-089599d29b45',
    email: 'shreyansh.tiwari8@gmail.com',
    fullName: 'Shreyansh Tiwari',
  },
  {
    id: 'a15fd021-d4b5-48e7-a359-a5a1086436cc',
    email: 'harshit2k9@gmail.com',
    fullName: 'Harshit Kumar',
  },
  {
    id: '8b426732-a277-4b10-af0b-5df264bbf939',
    email: 'namankashyap114@gmail.com',
    fullName: 'Naman Kashyap',
  },
];

async function main() {
  const adminSupabase = getSupabaseAdminClient();
  console.log('--- DISPATCHING WELCOME EMAILS TO 3 RECENT USERS ---');

  for (const user of TARGET_USERS) {
    console.log(`\nProcessing ${user.email} (${user.fullName})...`);

    // 1. Check idempotency: already sent?
    const { data: existingLog } = await adminSupabase
      .from('email_logs')
      .select('id, status, sent_at')
      .or(`user_id.eq.${user.id},recipient_email.eq.${user.email}`)
      .eq('email_type', 'welcome')
      .eq('status', 'sent')
      .limit(1)
      .maybeSingle();

    if (existingLog) {
      console.log(`[SKIP] User ${user.email} already has a sent welcome email log (${existingLog.id}) at ${existingLog.sent_at}`);
      continue;
    }

    // 2. Dispatch email using personal first name
    const firstName = user.fullName.split(' ')[0] || user.fullName;
    console.log(`[SENDING] Dispatching to ${user.email} with name "${firstName}"...`);
    const result = await sendWelcomeEmail(user.email, firstName);

    if (result.success && !result.skipped) {
      console.log(`[SUCCESS] Email delivered to ${user.email}!`);
      // 3. Log to DB for strict idempotency audit
      const { error: insertErr } = await adminSupabase.from('email_logs').insert({
        user_id: user.id,
        email_type: 'welcome',
        recipient_email: user.email,
        subject: `Hey ${firstName} — a quick note before your first Sunday review`,
        status: 'sent',
        sent_at: new Date().toISOString(),
      });

      if (insertErr) {
        console.error(`[WARN] Failed to insert email_log for ${user.email}:`, insertErr);
      } else {
        console.log(`[LOGGED] email_logs table updated with status: 'sent' for ${user.email}`);
      }
    } else {
      console.error(`[FAILED] Could not send to ${user.email}:`, result.error);
    }
  }

  console.log('\n--- ALL 3 USERS PROCESSED ---');
}

main().catch(console.error);
