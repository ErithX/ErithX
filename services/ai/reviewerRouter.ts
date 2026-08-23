import { callGemini } from "./providers/callGemini";
import { callLlama } from "./providers/callLlama";

export async function generateWeeklyReview(userStats: any) {
  try {
    // Primary Gemini
    return await callGemini(userStats);
  } catch (err) {
    console.error("Gemini failed, falling back to Llama", err);
    try {
      return await callLlama(userStats);
    } catch (llamaErr) {
      console.error("Llama fallback also failed", llamaErr);
      throw new Error("All LLM providers failed.");
    }
  }
}
