import { GoogleGenerativeAI } from "@google/generative-ai";
import { getReviewerPrompt, getPlannerPrompt } from "../prompts";

const ROY_MIN = 0;
const ROY_MAX = 5;

/**
 * Clamps the LLM-decided roy_factor into a sane integer range.
 * This is a safety net only — it never overrides the LLM unless the LLM
 * returns an out-of-range value. No DB migration needed (field already exists).
 */
function normalizeRoyFactor(value: any): number {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) return 0;
  return Math.min(ROY_MAX, Math.max(ROY_MIN, parsed));
}

/**
 * Lightweight serverless-friendly rate-limit guard (Bug 6 fix).
 * Gemini free tier allows ~5 requests/min per model; when the quota trips it
 * returns HTTP 429. Instead of failing the whole review, wait and retry a few
 * times with backoff. Cross-instance distributed throttling would need Redis.
 */
async function generateWithRetry<T>(run: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: any;
  let delay = 2000;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await run();
    } catch (err: any) {
      lastError = err;
      const isRateLimit = /429|quota|RATE_LIMIT|RESOURCE_EXHAUSTED|rate limit|too many requests/i.test(
        (err?.message || "") + (err?.statusText || "")
      );
      if (!isRateLimit || attempt >= attempts) break;
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }

  throw lastError || new Error("Gemini generation failed");
}

export async function callGeminiReviewer(userStats: any, careerTarget: string, royFactor: number) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

  const genAI = new GoogleGenerativeAI(apiKey);
  const weeklyFocus = userStats.review_focus_this_week || 'velocity_trends';
  
  // Remove routing fields from the payload since they are handled via prompt routing
  const payloadToSend = { ...userStats };
  delete payloadToSend.roy_factor;
  delete payloadToSend.career_target;
  delete payloadToSend.review_focus_this_week;

  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
    systemInstruction: getReviewerPrompt(careerTarget, royFactor, weeklyFocus),
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const result = await generateWithRetry(() => model.generateContent(JSON.stringify(payloadToSend)));
  const response = await result.response;
  const text = response.text();

  const parsed = JSON.parse(text);

  return {
    review_text: parsed.review_text,
    hidden_summary: parsed.hidden_summary,
    roy_factor: normalizeRoyFactor(parsed.roy_factor),
    model_used: "gemini-3.5-flash",
    prompt_tokens: response.usageMetadata?.promptTokenCount || 0
  };
}

export async function callGeminiPlanner(userStats: any, reviewText: string, careerTarget: string, isMonthlyRoadmap: boolean) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
    systemInstruction: getPlannerPrompt(careerTarget, isMonthlyRoadmap),
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const payloadToSend = { ...userStats };
  delete payloadToSend.roy_factor;
  delete payloadToSend.career_target;

  const payload = {
    ...payloadToSend,
    ai_generated_review_text_to_align_with: reviewText
  };

  const result = await generateWithRetry(() => model.generateContent(JSON.stringify(payload)));
  const response = await result.response;
  const text = response.text();

  const parsed = JSON.parse(text);

  return {
    targets_set: parsed.targets_set,
    monthly_roadmap: parsed.monthly_roadmap || null,
    model_used: "gemini-3.5-flash",
    prompt_tokens: response.usageMetadata?.promptTokenCount || 0
  };
}