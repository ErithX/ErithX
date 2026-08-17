// app/lib/email/emailService.ts
import nodemailer from 'nodemailer';

interface Contest {
  platform: string;
  title: string;
  url: string;
  startTime: string;
  duration: number;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const UNSUBSCRIBE_URL = `${APP_URL}/dashboard/settings`;
const PHYSICAL_ADDRESS = 'DSA Quest, India';
const SENDER_NAME = 'DSA Quest';
const SENDER_EMAIL = process.env.SMTP_USER || '';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    logger: false,
    debug: false,
  });
}

export async function verifyEmailConfig() {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email service is ready');
    return true;
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
}

export async function sendEmail({ to, subject, html, text }: EmailOptions, retries = 3) {
  let lastError: any;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const transporter = createTransporter();

      console.log(`Attempt ${attempt}/${retries} - Sending email to ${to}`);

      const info = await transporter.sendMail({
        from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
        to,
        subject,
        html,
        text: text || stripHtml(html),
        headers: {
          'List-Unsubscribe': `<${UNSUBSCRIBE_URL}>`,
          'X-Mailer': 'DSAQuest',
          'Precedence': 'bulk',
        },
      });

      console.log(`Email sent: ${info.messageId} to ${to}`);
      transporter.close();
      return { success: true, messageId: info.messageId };
    } catch (error) {
      lastError = error;
      console.error(`Email attempt ${attempt} failed:`, error);

      if (attempt < retries) {
        const waitTime = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  console.error(`All ${retries} attempts failed for ${to}`);
  return { success: false, error: lastError };
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });
}

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:8px;border:1px solid #e5e7eb;overflow:hidden;">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function emailFooter(): string {
  return `
    <tr>
      <td style="padding:24px 32px;background-color:#f9fafb;border-top:1px solid #e5e7eb;">
        <p style="margin:0 0 8px 0;font-size:12px;color:#6b7280;line-height:1.6;text-align:center;">
          You received this because you have an account on DSA Quest.
          <br>
          <a href="${UNSUBSCRIBE_URL}" style="color:#3b82f6;text-decoration:underline;">Manage email preferences</a>
          &nbsp;&middot;&nbsp;
          <a href="${APP_URL}/about" style="color:#3b82f6;text-decoration:underline;">About DSA Quest</a>
        </p>
        <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.6;text-align:center;">
          ${SENDER_NAME} &middot; ${PHYSICAL_ADDRESS}
          <br>
          This is a transactional email related to your account activity.
        </p>
      </td>
    </tr>`;
}

// --- WELCOME EMAIL ---

export async function sendWelcomeEmail(userEmail: string, userName: string, upcomingContests?: Contest[], topResource?: any) {
  const subject = 'Welcome to DSA Quest ✨';
  const html = emailWrapper(`
    <tr>
      <td style="padding:32px 32px 24px 32px;">
        <h1 style="margin:0 0 8px 0;font-size:22px;color:#111827;font-weight:700;">Welcome to DSA Quest</h1>
        <p style="margin:0;font-size:14px;color:#6b7280;">Your coding contest tracker is ready.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 24px 32px;">
        <p style="margin:0 0 16px 0;font-size:15px;color:#374151;line-height:1.6;">
          Hey ${userName},
        </p>
        <p style="margin:0 0 16px 0;font-size:15px;color:#374151;line-height:1.6;">
          Thanks for signing up. DSA Quest tracks upcoming coding contests from LeetCode, Codeforces, CodeChef, AtCoder, and more &mdash; all in one place.
        </p>
        <p style="margin:0 0 24px 0;font-size:15px;color:#374151;line-height:1.6;">
          Here is what you can do right now:
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
          <tr>
            <td style="padding:8px 0;font-size:14px;color:#374151;">
              <span style="color:#10b981;font-weight:700;">1.</span>&nbsp;&nbsp;Browse upcoming contests filtered by platform and difficulty
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:14px;color:#374151;">
              <span style="color:#10b981;font-weight:700;">2.</span>&nbsp;&nbsp;Get email alerts before contests you care about start
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:14px;color:#374151;">
              <span style="color:#10b981;font-weight:700;">3.</span>&nbsp;&nbsp;Access curated DSA resources and roadmaps
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:14px;color:#374151;">
              <span style="color:#10b981;font-weight:700;">4.</span>&nbsp;&nbsp;Track your progress across platforms
            </td>
          </tr>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background-color:#10b981;border-radius:6px;">
              <a href="${APP_URL}/contests" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">
                Browse Contests
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${topResource ? `
    <tr>
      <td style="padding:0 32px 24px 32px;">
        <p style="margin:0 0 16px 0;font-size:15px;color:#374151;font-weight:700;">Top Resource Pick for You</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;background-color:#fff;">
          <tr>
            <td style="padding:16px;">
              ${topResource.coverImage ? `<img src="${topResource.coverImage}" alt="Cover" style="width:100%;height:140px;object-fit:cover;border-radius:6px;margin-bottom:12px;" />` : ''}
              <p style="margin:0 0 8px 0;font-size:16px;color:#111827;font-weight:700;">${topResource.title}</p>
              ${topResource.subtitle ? `<p style="margin:0 0 12px 0;font-size:13px;color:#6b7280;">${topResource.subtitle}</p>` : ''}
              <a href="${APP_URL}/resources/${topResource.slug || topResource._id}" style="display:inline-block;font-size:13px;font-weight:600;color:#3b82f6;text-decoration:none;">Read Now &rarr;</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ` : ''}
    ${upcomingContests && upcomingContests.length > 0 ? `
    <tr>
      <td style="padding:0 32px 24px 32px;">
        <p style="margin:0 0 16px 0;font-size:15px;color:#374151;font-weight:700;">Upcoming Contests</p>
        ${upcomingContests.slice(0, 3).map((c: Contest) => `
          <div style="margin-bottom:12px;padding:12px;border:1px solid #e5e7eb;border-radius:6px;">
            <p style="margin:0 0 4px 0;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;">${c.platform}</p>
            <p style="margin:0 0 4px 0;font-size:14px;color:#111827;font-weight:600;">${c.title}</p>
            <p style="margin:0;font-size:12px;color:#6b7280;">${formatDate(c.startTime)} at ${formatTime(c.startTime)}</p>
          </div>
        `).join('')}
      </td>
    </tr>
    ` : ''}
    <tr>
      <td style="padding:0 32px 24px 32px;">
        <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
          You can turn off email notifications anytime from your
          <a href="${UNSUBSCRIBE_URL}" style="color:#3b82f6;text-decoration:underline;">settings page</a>.
        </p>
      </td>
    </tr>
    ${emailFooter()}
  `);

  return sendEmail({ to: userEmail, subject, html });
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

  const subject = subjectLine || `${contests.length} contest${contests.length > 1 ? 's' : ''} starting soon on DSA Quest`;
  const html = emailWrapper(`
    <tr>
      <td style="padding:32px 32px 24px 32px;">
        <h1 style="margin:0 0 8px 0;font-size:22px;color:#111827;font-weight:700;">Your Contest Digest</h1>
        <p style="margin:0;font-size:14px;color:#6b7280;">${formatDate(new Date().toISOString())}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 24px 32px;">
        <p style="margin:0 0 20px 0;font-size:15px;color:#374151;line-height:1.6;">
          Hey ${userName}, here ${contests.length === 1 ? 'is' : 'are'} <strong>${contests.length} contest${contests.length > 1 ? 's' : ''}</strong> starting in the next 24 hours.
        </p>
        ${contests.map(c => `
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:12px;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
            <tr>
              <td style="padding:16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <span style="display:inline-block;font-size:11px;font-weight:600;color:#374151;background-color:#f3f4f6;padding:3px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:0.5px;">
                        ${c.platform}
                      </span>
                    </td>
                    <td align="right">
                      <span style="font-size:12px;color:#6b7280;">
                        ${formatDuration(c.duration)}
                      </span>
                    </td>
                  </tr>
                </table>
                <p style="margin:10px 0 8px 0;font-size:15px;color:#111827;font-weight:600;line-height:1.4;">
                  ${c.title}
                </p>
                <p style="margin:0 0 12px 0;font-size:13px;color:#6b7280;">
                  ${formatDate(c.startTime)} at ${formatTime(c.startTime)}
                </p>
                <a href="${c.url}" style="display:inline-block;font-size:13px;font-weight:600;color:#3b82f6;text-decoration:none;">
                  View Contest &rarr;
                </a>
              </td>
            </tr>
          </table>
        `).join('')}
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 24px 32px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;">
          <tr>
            <td style="padding:16px;">
              <p style="margin:0 0 6px 0;font-size:13px;color:#166534;font-weight:600;">Before you compete</p>
              <p style="margin:0;font-size:13px;color:#166534;line-height:1.6;">
                Review your recent patterns. Check the contest rules and scoring. Keep your templates ready.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${topResource ? `
    <tr>
      <td style="padding:0 32px 24px 32px;">
        <p style="margin:0 0 16px 0;font-size:15px;color:#374151;font-weight:700;">Top Resource For You</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;background-color:#fff;">
          <tr>
            <td style="padding:16px;">
              ${topResource.coverImage ? `<img src="${topResource.coverImage}" alt="Cover" style="width:100%;height:140px;object-fit:cover;border-radius:6px;margin-bottom:12px;" />` : ''}
              <p style="margin:0 0 8px 0;font-size:16px;color:#111827;font-weight:700;">${topResource.title}</p>
              ${topResource.subtitle ? `<p style="margin:0 0 12px 0;font-size:13px;color:#6b7280;">${topResource.subtitle}</p>` : ''}
              <a href="${APP_URL}/resources/${topResource.slug || topResource._id}" style="display:inline-block;font-size:13px;font-weight:600;color:#3b82f6;text-decoration:none;">Read Now &rarr;</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ` : ''}
    <tr>
      <td style="padding:0 32px 24px 32px;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background-color:#3b82f6;border-radius:6px;">
              <a href="${APP_URL}/contests" style="display:inline-block;padding:10px 20px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;">
                View All Contests
              </a>
            </td>
            <td style="width:12px;"></td>
            <td style="background-color:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;">
              <a href="${APP_URL}/resources" style="display:inline-block;padding:10px 20px;font-size:13px;font-weight:600;color:#374151;text-decoration:none;">
                Study Resources
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

// --- CONTEST ALERT (24h before a specific contest) ---

export async function sendContestAlert(
  userEmail: string,
  userName: string,
  contest: Contest,
  subjectLine?: string
) {
  const subject = subjectLine || `Reminder: ${contest.title} starts ${formatTime(contest.startTime)}`;
  const html = emailWrapper(`
    <tr>
      <td style="padding:32px 32px 24px 32px;">
        <h1 style="margin:0 0 8px 0;font-size:22px;color:#111827;font-weight:700;">Contest Reminder</h1>
        <p style="margin:0;font-size:14px;color:#6b7280;">Starting within 24 hours</p>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 24px 32px;">
        <p style="margin:0 0 16px 0;font-size:15px;color:#374151;line-height:1.6;">
          Hey ${userName},
        </p>
        <p style="margin:0 0 20px 0;font-size:15px;color:#374151;line-height:1.6;">
          A contest you may be interested in is starting soon:
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;margin-bottom:20px;">
          <tr>
            <td style="padding:20px;">
              <span style="display:inline-block;font-size:11px;font-weight:600;color:#374151;background-color:#f3f4f6;padding:3px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:0.5px;">
                ${contest.platform}
              </span>
              <p style="margin:12px 0 8px 0;font-size:17px;color:#111827;font-weight:700;line-height:1.4;">
                ${contest.title}
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="padding:4px 0;font-size:13px;color:#6b7280;">
                    Date: <strong style="color:#374151;">${formatDate(contest.startTime)}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 0;font-size:13px;color:#6b7280;">
                    Time: <strong style="color:#374151;">${formatTime(contest.startTime)}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 0;font-size:13px;color:#6b7280;">
                    Duration: <strong style="color:#374151;">${formatDuration(contest.duration)}</strong>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#10b981;border-radius:6px;">
                    <a href="${contest.url}" style="display:inline-block;padding:10px 20px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;">
                      Join Contest
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 24px 32px;">
        <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
          You are receiving this because you enabled contest alerts.
          <a href="${UNSUBSCRIBE_URL}" style="color:#3b82f6;text-decoration:underline;">Change preferences</a>
        </p>
      </td>
    </tr>
    ${emailFooter()}
  `);

  return sendEmail({ to: userEmail, subject, html });
}

// --- PRODUCT UPDATE ---

export async function sendProductUpdate(
  userEmail: string,
  userName: string,
  updateTitle: string,
  updateSummary: string,
  updateUrl?: string
) {
  const subject = `DSA Quest: ${updateTitle}`;
  const html = emailWrapper(`
    <tr>
      <td style="padding:32px 32px 24px 32px;">
        <h1 style="margin:0 0 8px 0;font-size:22px;color:#111827;font-weight:700;">Product Update</h1>
        <p style="margin:0;font-size:14px;color:#6b7280;">What's new on DSA Quest</p>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 24px 32px;">
        <p style="margin:0 0 16px 0;font-size:15px;color:#374151;line-height:1.6;">
          Hey ${userName},
        </p>
        <p style="margin:0 0 20px 0;font-size:15px;color:#374151;line-height:1.6;">
          We have been working on improvements to DSA Quest. Here is the latest:
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;margin-bottom:20px;">
          <tr>
            <td style="padding:20px;">
              <h2 style="margin:0 0 10px 0;font-size:17px;color:#111827;font-weight:700;">${updateTitle}</h2>
              <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.6;">
                ${updateSummary}
              </p>
              ${updateUrl ? `
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                  <tr>
                    <td style="background-color:#3b82f6;border-radius:6px;">
                      <a href="${updateUrl}" style="display:inline-block;padding:10px 20px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;">
                        Learn More
                      </a>
                    </td>
                  </tr>
                </table>
              ` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 24px 32px;">
        <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
          You are receiving this because you enabled product updates.
          <a href="${UNSUBSCRIBE_URL}" style="color:#3b82f6;text-decoration:underline;">Unsubscribe</a>
        </p>
      </td>
    </tr>
    ${emailFooter()}
  `);

  return sendEmail({ to: userEmail, subject, html });
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
