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
const ENABLE_EMAILS = process.env.ENABLE_EMAIL_SERVICE === 'true';

export async function sendWelcomeEmail(userEmail: string, userName: string, upcomingContests?: Contest[], topResource?: any) {
  if (!ENABLE_EMAILS) {
    console.log(`[KILL SWITCH] Emails are currently disabled. Skipped Welcome Email to ${userEmail}`);
    return { success: true, skipped: true };
  }

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
  if (!ENABLE_EMAILS) {
    console.log(`[KILL SWITCH] Emails are currently disabled. Skipped Mentor Report Email to ${userEmail}`);
    return { success: true, skipped: true };
  }

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

  if (!ENABLE_EMAILS) {
    console.log(`[KILL SWITCH] Emails are currently disabled. Skipped Digest Email to ${userEmail}`);
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
  if (!ENABLE_EMAILS) {
    console.log(`[KILL SWITCH] Emails are currently disabled. Skipped Alert Email to ${userEmail}`);
    return { success: true, skipped: true };
  }

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
  if (!ENABLE_EMAILS) {
    console.log(`[KILL SWITCH] Emails are currently disabled. Skipped Product Update Email to ${userEmail}`);
    return { success: true, skipped: true };
  }

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

// --- MENTOR WEEKLY REVIEW EMAIL ---

export async function sendWeeklyReviewEmail(
  userEmail: string,
  userName: string,
  reviewHook: string
) {
  // A serious, professional subject line
  const subject = `DSA Quest Mentor Review: Weekly Performance Update for ${userName}`;
  
  const html = emailWrapper(`
    <tr>
      <td style="padding:32px 32px 24px 32px;">
        <h1 style="margin:0 0 8px 0;font-size:22px;color:#111827;font-weight:700;">Weekly Mentor Review</h1>
        <p style="margin:0;font-size:14px;color:#6b7280;">Your performance analysis is ready.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 24px 32px;">
        <p style="margin:0 0 16px 0;font-size:15px;color:#374151;line-height:1.6;">
          Hey ${userName},
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #e5e7eb;border-left:4px solid #3b82f6;border-radius:4px;overflow:hidden;margin-bottom:24px;background-color:#f9fafb;">
          <tr>
            <td style="padding:20px;">
              <p style="margin:0;font-size:15px;color:#374151;line-height:1.6;font-style:italic;">
                "${reviewHook}"
              </p>
            </td>
          </tr>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background-color:#111827;border-radius:6px;">
              <a href="${APP_URL}/dashboard" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">
                View Your Full Report
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 24px 32px;">
        <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
          You are receiving this automated mentor review because it is enabled for your account.
        </p>
      </td>
    </tr>
    ${emailFooter()}
  `);

  return sendEmail({ to: userEmail, subject, html });
}

// --- SUSPENSION & REACTIVATION EMAILS ---

export async function sendInactivityWarningEmail(userEmail: string, userName: string) {
  const subject = `Notice: Your DSA Quest Mentor Reviews will be paused soon`;
  const html = emailWrapper(`
    <tr>
      <td style="padding:32px 32px 24px 32px;">
        <h1 style="margin:0 0 8px 0;font-size:22px;color:#111827;font-weight:700;">Dashboard Inactivity Notice</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 24px 32px;">
        <p style="margin:0 0 16px 0;font-size:15px;color:#374151;line-height:1.6;">
          Hey ${userName},
        </p>
        <p style="margin:0 0 16px 0;font-size:15px;color:#374151;line-height:1.6;">
          We noticed you haven't checked your dashboard in the last 12 days. To ensure we are only sending mentor feedback to active students, your weekly review emails will automatically pause in 2 days.
        </p>
        <p style="margin:0 0 24px 0;font-size:15px;color:#374151;line-height:1.6;">
          If you want to keep receiving these personalized insights, simply log in to your dashboard to keep your account active.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background-color:#111827;border-radius:6px;">
              <a href="${APP_URL}/dashboard" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">
                Keep My Account Active
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${emailFooter()}
  `);

  return sendEmail({ to: userEmail, subject, html });
}

export async function sendReactivationApprovedEmail(userEmail: string, userName: string) {
  const subject = `Your Mentor Reviews are active again`;
  const html = emailWrapper(`
    <tr>
      <td style="padding:32px 32px 24px 32px;">
        <h1 style="margin:0 0 8px 0;font-size:22px;color:#111827;font-weight:700;">Welcome Back</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 24px 32px;">
        <p style="margin:0 0 16px 0;font-size:15px;color:#374151;line-height:1.6;">
          Hey ${userName},
        </p>
        <p style="margin:0 0 24px 0;font-size:15px;color:#374151;line-height:1.6;">
          Your request to reactivate has been approved by the mentor team. Your automated Weekly AI Reviews will resume immediately on the next scheduled cycle.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background-color:#10b981;border-radius:6px;">
              <a href="${APP_URL}/dashboard" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">
                Go to Dashboard
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${emailFooter()}
  `);

  return sendEmail({ to: userEmail, subject, html });
}
