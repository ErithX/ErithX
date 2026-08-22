import { Resend } from 'resend';

// Only initialize Resend if the API key is present
export const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;
