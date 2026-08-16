
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "../prompts";

export async function callGemini(userStats: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const result = await model.generateContent(JSON.stringify(userStats));
  const response = await result.response;
  const text = response.text();

  const parsed = JSON.parse(text);

  return {
    review_text: parsed.review_text,
    targets_set: parsed.targets_set,
    roy_factor_update: parsed.roy_factor_update || 0,
    model_used: "gemini-3.5-flash",
    prompt_tokens: response.usageMetadata?.promptTokenCount || 0
  };
}
