import { callLlama } from "./providers/callLlama";
import { callGemini } from "./providers/callGemini";
import { callGlm } from "./providers/callGlm";

export async function generateWeeklyReview(userStats: any) {
  try {

    const useLlamaFirst = userStats.last_model_used !== "llama-3.3-70b";

    if (useLlamaFirst) {
      // Primary Llama, Fallback Gemini
      try {
        return await callLlama(userStats);
      } catch (err) {
        console.error("Llama failed, falling back to Gemini", err);
        return await callGemini(userStats);
      }
    } else {
      // Primary Gemini, Fallback Llama
      try {
        return await callGemini(userStats);
      } catch (err) {
        console.error("Gemini failed, falling back to Llama", err);
        return await callLlama(userStats);
      }
    }
  } catch (criticalErr) {
    // Both Tier 1 and Tier 2 fallbacks failed. Use universal GLM fallback.
    console.error("Primary and secondary models failed. Using GLM Fallback.", criticalErr);
    return await callGlm(userStats);
  }
}
