import { getReviewerPrompt } from "../prompts";

/**
 * Legacy NIM (NVIDIA) provider — kept for the 3rd-tier fallback path.
 * Uses the same Reviewer prompt routing as Gemini/Groq. Unused in the
 * current router; maintained so the module graph type-checks.
 */
export async function callNemotron(userStats: any) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error("NVIDIA_API_KEY is missing");

  const careerTarget = userStats.career_target || "I want to balance everything";
  const royFactor = userStats.roy_factor || 0;
  const weeklyFocus = userStats.review_focus_this_week || 'velocity_trends';

  const payloadToSend = { ...userStats };
  delete payloadToSend.roy_factor;
  delete payloadToSend.career_target;
  delete payloadToSend.review_focus_this_week;

  const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: "nvidia/nemotron-4-340b-instruct",
      messages: [
        { role: "system", content: getReviewerPrompt(careerTarget, royFactor, weeklyFocus) },
        { role: "user", content: JSON.stringify(payloadToSend) },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(`LLM Error: ${JSON.stringify(data)}`);

  const resultStr = data.choices[0].message.content;
  const jsonMatch = resultStr.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`No JSON found in Nemotron response: ${resultStr}`);
  const result = JSON.parse(jsonMatch[0]);

  const rawRoy = parseInt(result.roy_factor, 10);
  const royFactorValue = isNaN(rawRoy) ? 0 : Math.min(5, Math.max(0, rawRoy));

  return {
    review_text: result.review_text,
    targets_set: result.targets_set || "",
    roy_factor: royFactorValue,
    model_used: "nemotron-4-340b",
    prompt_tokens: data.usage?.prompt_tokens || 0
  };
}