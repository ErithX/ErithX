import { sendWeeklyReviewEmail } from './app/lib/email/emailService.js';
import * as dotenv from 'dotenv';
dotenv.config();

console.log("Starting email test...");
console.log("ENABLE_EMAIL_SERVICE is:", process.env.ENABLE_EMAIL_SERVICE);
process.env.ENABLE_EMAIL_SERVICE = 'true';
console.log("RESEND API KEY exists:", !!process.env.RESEND_API_KEY);

async function test() {
    const res = await sendWeeklyReviewEmail('debjyoti2409@gmail.com', 'Debjyoti', 'This is a test preview text from the scratch script.');
    console.log("Result:", res);
}
test();
