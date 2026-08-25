import { NextResponse } from 'next/server';
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import { sendWeeklyReviewEmail } from '@/app/lib/email/emailService';

async function handler(request: Request) {
  try {
    console.log("QStash hit the test-email endpoint successfully.");
    
    // We will send a dummy email to test Resend integration
    const res = await sendWeeklyReviewEmail(
      'debjyoti2409@gmail.com', 
      'Debjyoti (Test)', 
      'This is a pure QStash to Vercel to Resend test. NO LLM tokens were used. If you are reading this, QStash signature verification and email delivery are working 100%.'
    );

    return NextResponse.json({ 
      success: true, 
      message: 'QStash to Vercel connection is working!',
      email_status: res.success ? 'Sent successfully' : 'Failed to send' 
    });
  } catch (error: any) {
    console.error("Test email failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// We use the exact same signature verification as the main route
export const POST = process.env.NODE_ENV === 'development' 
  ? handler 
  : verifySignatureAppRouter(handler);
