import { getReviewerPrompt, getPlannerPrompt } from "../prompts";

const GROQ_MODEL = "openai/gpt-oss-120b"; // llama-3.3-70b-versatile is RETIRED (404) on Groq — Bug 2 fix

const ROY_MIN = 0;
const ROY_MAX = 5;

function normalizeRoyFactor(value: any): number {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) return 0;
  return Math.min(ROY_MAX, Math.max(ROY_MIN, parsed));
}

/**
 * Builds the ordered list of Groq API keys to try.
 * The primary GROK_API_KEY currently returns 401 (invalid/rotated), while
 * GROQ_FALLBACK_KEY is the confirmed-working key — so we try it first to
 * avoid ~3-5s of dead latency on every fallback path. Bug 1 fix.
 */
function getKeysToTry(): string[] {
  const primaryKey = process.env.GROK_API_KEY;
  const fallbackKey = process.env.GROQ_FALLBACK_KEY;
  const keys = [fallbackKey, primaryKey].filter(Boolean) as string[];
  if (keys.length === 0) throw new Error("GROK_API_KEY and GROQ_FALLBACK_KEY are missing");
  return keys;
}

export async function callLlamaReviewer(userStats: any, careerTarget: string, royFactor: number) {
  const keysToTry = getKeysToTry();
  let lastError;
  let responseData;

  const weeklyFocus = userStats.review_focus_this_week || 'velocity_trends';

  const payloadToSend = { ...userStats };
  delete payloadToSend.roy_factor;
  delete payloadToSend.career_target;
  delete payloadToSend.review_focus_this_week;

  for (const apiKey of keysToTry) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: "system", content: getReviewerPrompt(careerTarget, royFactor, weeklyFocus) },
            { role: "user", content: JSON.stringify(payloadToSend) },
          ],
          response_format: { type: "json_object" }, 
          temperature: 0.7,
        }),
      });

      responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(`LLM Error: ${JSON.stringify(responseData)}`);
      }
      break;
    } catch (err: any) {
      lastError = err;
      responseData = null;
    }
  }

  if (!responseData) {
    throw lastError || new Error("All Groq API keys failed");
  }

  const result = JSON.parse(responseData.choices[0].message.content);

  return {
    review_text: result.review_text,
    hidden_summary: result.hidden_summary,
    roy_factor: normalizeRoyFactor(result.roy_factor),
    model_used: "gpt-oss-120b",
    prompt_tokens: responseData.usage?.prompt_tokens || 0
  };
}

export async function callLlamaPlanner(userStats: any, reviewText: string, careerTarget: string, isMonthlyRoadmap: boolean) {
  const keysToTry = getKeysToTry();
  let lastError;
  let responseData;

  const payloadToSend = { ...userStats };
  delete payloadToSend.roy_factor;
  delete payloadToSend.career_target;

  const payload = {
    ...payloadToSend,
    ai_generated_review_text_to_align_with: reviewText
  };

  for (const apiKey of keysToTry) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: "system", content: getPlannerPrompt(careerTarget, isMonthlyRoadmap) },
            { role: "user", content: JSON.stringify(payload) },
          ],
          response_format: { type: "json_object" }, 
          temperature: 0.7,
        }),
      });

      responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(`LLM Error: ${JSON.stringify(responseData)}`);
      }
      break;
    } catch (err: any) {
      lastError = err;
      responseData = null;
    }
  }

  if (!responseData) {
    throw lastError || new Error("All Groq API keys failed");
  }

  const result = JSON.parse(responseData.choices[0].message.content);

  return {
    targets_set: result.targets_set,
    monthly_roadmap: result.monthly_roadmap || null,
    model_used: "gpt-oss-120b",
    prompt_tokens: responseData.usage?.prompt_tokens || 0
  };
}