// app/lib/email/emailService.ts
import { resend } from './resendClient';
import WelcomeEmail from './templates/WelcomeEmail';
import MentorReportEmail from './templates/MentorReportEmail';
import DigestEmail from './templates/DigestEmail';
import AlertEmail from './templates/AlertEmail';
import * as React from 'react';

interface Contest {
  platform: string;
  title: string;
  url: string;
  startTime: string;
  duration: number;
}

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

export async function sendWelcomeEmail(userEmail: string, userName: string, upcomingContests?: Contest[], topResource?: any) {
  if (!resend) {
    console.warn(`[EMAIL DISABLED] No RESEND_API_KEY. Blocked Welcome email to ${userEmail}`);
    return { success: true };
  }

  try {
    const data = await resend.emails.send({
      from: 'Debjyoti <debjyoti@erithx.dev>',
      to: userEmail,
      subject: 'Welcome to ErithX ✨',
      react: WelcomeEmail({ userName }) as React.ReactElement,
    });

    console.log(`Welcome Email sent to ${userEmail}`, data);
    return { success: true, data };
  } catch (error) {
    console.error(`Failed to send Welcome Email to ${userEmail}`, error);
    return { success: false, error };
  }
}

export async function sendMentorReportEmail(userEmail: string, userName: string, projectTitle: string, aiFeedbackText: string) {
  if (!resend) {
    console.warn(`[EMAIL DISABLED] No RESEND_API_KEY. Blocked Mentor email to ${userEmail}`);
    return { success: true };
  }

  try {
    const data = await resend.emails.send({
      from: 'ErithX Mentor <mentor@erithx.dev>',
      to: userEmail,
      subject: 'Your architecture review is ready',
      react: MentorReportEmail({ userName, projectTitle, aiFeedbackText }) as React.ReactElement,
    });

    console.log(`Mentor Email sent to ${userEmail}`, data);
    return { success: true, data };
  } catch (error) {
    console.error(`Failed to send Mentor Email to ${userEmail}`, error);
    return { success: false, error };
  }
}

// --- DAILY CONTEST DIGEST ---

export async function sendDailyContestDigest(
  userEmail: string,
  userName: string,
  contests: Contest[],
  subjectLine?: string,
  topResource?: any
) {
  if (!contests || contests.length === 0) {
    console.log(`No contests for ${userEmail}, skipping digest`);
    return { success: true, skipped: true };
  }

  if (!resend) {
    console.warn(`[EMAIL DISABLED] No RESEND_API_KEY. Blocked Digest email to ${userEmail}`);
    return { success: true };
  }

  const subject = subjectLine || `${contests.length} contest${contests.length > 1 ? 's' : ''} starting soon on ErithX`;
  
  try {
    const data = await resend.emails.send({
      from: 'ErithX Contests <contest@erithx.dev>',
      to: userEmail,
      subject,
      react: DigestEmail({ userName, contests, topResource }) as React.ReactElement,
    });
    console.log(`Digest Email sent to ${userEmail}`, data);
    return { success: true, data };
  } catch (error) {
    console.error(`Failed to send Digest Email to ${userEmail}`, error);
    return { success: false, error };
  }
}

// --- CONTEST ALERT (24h before a specific contest) ---

export async function sendContestAlert(
  userEmail: string,
  userName: string,
  contest: Contest,
  subjectLine?: string
) {
  if (!resend) {
    console.warn(`[EMAIL DISABLED] No RESEND_API_KEY. Blocked Alert email to ${userEmail}`);
    return { success: true };
  }

  const subject = subjectLine || `Reminder: ${contest.title} starts soon`;

  try {
    const data = await resend.emails.send({
      from: 'ErithX Contests <contest@erithx.dev>',
      to: userEmail,
      subject,
      react: AlertEmail({ userName, contest }) as React.ReactElement,
    });
    console.log(`Alert Email sent to ${userEmail}`, data);
    return { success: true, data };
  } catch (error) {
    console.error(`Failed to send Alert Email to ${userEmail}`, error);
    return { success: false, error };
  }
}

// --- PRODUCT UPDATE ---

export async function sendProductUpdate(
  userEmail: string,
  userName: string,
  updateTitle: string,
  updateSummary: string,
  updateUrl?: string
) {
  if (!resend) {
    console.warn(`[EMAIL DISABLED] No RESEND_API_KEY. Blocked Product Update email to ${userEmail}`);
    return { success: true };
  }

  try {
    const data = await resend.emails.send({
      from: 'Debjyoti <debjyoti@erithx.dev>',
      to: userEmail,
      subject: `ErithX: ${updateTitle}`,
      html: `<p>Hi ${userName},</p><p>${updateSummary}</p>${updateUrl ? `<a href="${updateUrl}">Read more</a>` : ''}`
    });
    console.log(`Product Update Email sent to ${userEmail}`, data);
    return { success: true, data };
  } catch (error) {
    console.error(`Failed to send Product Update Email to ${userEmail}`, error);
    return { success: false, error };
  }
}
