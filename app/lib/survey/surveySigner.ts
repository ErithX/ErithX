import crypto from 'node:crypto';

export interface SurveyEmailUrlOptions {
  email?: string;
  surveyId?: string;
  expiresInDays?: number;
}

/**
 * Generates a tamper-proof, cryptographically signed survey URL for email dispatch.
 * Does NOT touch any database. Pure CPU computation in < 0.1ms.
 */
export function generateSurveyEmailUrl(
  userId: string,
  options?: SurveyEmailUrlOptions
): string {
  const secret = process.env.SURVEY_HMAC_SECRET || 'erithx_survey_default_hmac_secret_key_32_bytes';
  const baseUrl = process.env.SURVEY_BASE_URL || 'https://survey.erithx.dev';
  const expiresInDays = options?.expiresInDays ?? 14;

  const exp = Math.floor(Date.now() / 1000) + expiresInDays * 86400;

  const payloadObj = {
    uid: userId,
    em: options?.email || '',
    sid: options?.surveyId || 'erithx_nov_2026_pmf',
    src: 'email',
    exp
  };

  const payloadString = JSON.stringify(payloadObj);
  const encodedPayload = Buffer.from(payloadString).toString('base64url');

  const signature = crypto
    .createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url');

  return `${baseUrl.replace(/\/$/, '')}/?token=${encodedPayload}.${signature}`;
}

