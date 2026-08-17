import { SYSTEM_PROMPT } from "../prompts";

export async function callGlm(userStats: any) {
  const apiKey = process.env.GLM_API_KEY || process.env["GLM_5.2_API_KEY"];
  if (!apiKey) throw new Error("GLM_API_KEY is missing");

  const response = await fetch("https://api.z.ai/api/paas/v4/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: "glm-5.2",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify(userStats) },
      ],
      temperature: 0.7,
      max_tokens: 4096
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(`LLM Error: ${JSON.stringify(data)}`);

  const resultStr = data.choices[0].message.content;
  const jsonMatch = resultStr.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`No JSON found in GLM response: ${resultStr}`);
  const result = JSON.parse(jsonMatch[0]);

  return {
    review_text: result.review_text,
    hidden_summary: result.hidden_summary,
    targets_set: result.targets_set,
    roy_factor_update: result.roy_factor_update || 0,
    model_used: "glm-5.2",
    prompt_tokens: data.usage?.prompt_tokens || 0
  };
}
