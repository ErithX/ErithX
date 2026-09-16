import { callGeminiReviewer, callGeminiPlanner } from "./providers/callGemini";
import { callLlamaReviewer, callLlamaPlanner } from "./providers/callLlama";

export async function generateWeeklyReview(userStats: any, isMonthlyRoadmap: boolean = false) {
  const careerTarget = userStats.career_target || "I want to balance everything";
  const royFactor = userStats.roy_factor || 0;
  
  let reviewerResult;
  let plannerResult;
  
  // 1. Call the Reviewer
  try {
    reviewerResult = await callGeminiReviewer(userStats, careerTarget, royFactor);
  } catch (err) {
    console.error("Gemini Reviewer failed, falling back to Llama", err);
    try {
      reviewerResult = await callLlamaReviewer(userStats, careerTarget, royFactor);
    } catch (llamaErr) {
      console.error("Llama Reviewer fallback also failed", llamaErr);
      throw new Error("All LLM providers failed for Reviewer.");
    }
  }

  // 2. Call the Planner
  try {
    plannerResult = await callGeminiPlanner(userStats, reviewerResult.review_text, careerTarget, isMonthlyRoadmap);
  } catch (err) {
    console.error("Gemini Planner failed, falling back to Llama", err);
    try {
      plannerResult = await callLlamaPlanner(userStats, reviewerResult.review_text, careerTarget, isMonthlyRoadmap);
    } catch (llamaErr) {
      console.error("Llama Planner fallback also failed", llamaErr);
      // If planner fails, we can just return a basic empty target to not fail the whole review
      plannerResult = {
        targets_set: "Focus on your weaker areas as highlighted in the review.",
        monthly_roadmap: null,
        prompt_tokens: 0
      };
    }
  }

  // 3. Combine results
  return {
    review_text: reviewerResult.review_text,
    hidden_summary: reviewerResult.hidden_summary,
    roy_factor: reviewerResult.roy_factor,
    targets_set: plannerResult.targets_set,
    monthly_roadmap: plannerResult.monthly_roadmap,
    model_used: reviewerResult.model_used,
    prompt_tokens: reviewerResult.prompt_tokens + plannerResult.prompt_tokens
  };
}
