import { NextResponse } from 'next/server';
import { sendWelcomeEmail, sendMentorReportEmail } from '../../lib/email/emailService';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }

  const TEST_EMAILS = [
    'debjyoti2409@gmail.com',
    'rumkis1983@gmail.com',
    'ece2023110@rcciit.org.in'
  ];
  
  try {
    for (const email of TEST_EMAILS) {
      // Test 1: Welcome Email
      await sendWelcomeEmail(
        email,
        'Debjyoti',
        [],
        null
      );
      
      // Test 2: Mentor Email
      await sendMentorReportEmail(
        email,
        'Debjyoti',
        'System Design for Scalable RAG Apps',
        'Excellent use of Redis for caching embeddings. However, you should consider adding a rate limiter for the API endpoints to prevent abuse during high load.'
      );
    }

    return NextResponse.json({ success: true, message: `Sent test emails to ${TEST_EMAILS.join(', ')}` });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
