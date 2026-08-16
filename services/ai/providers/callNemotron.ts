import { SYSTEM_PROMPT } from "../prompts";

export async function callNemotron(userStats: any) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error("NVIDIA_API_KEY is missing");

  const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: "nvidia/nemotron-4-340b-instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify(userStats) },
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

  return {
    review_text: result.review_text,
    targets_set: result.targets_set,
    roy_factor_update: result.roy_factor_update || 0,
    model_used: "nemotron-4-340b",
    prompt_tokens: data.usage?.prompt_tokens || 0
  };
}
