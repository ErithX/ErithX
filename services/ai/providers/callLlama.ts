import { SYSTEM_PROMPT } from "../prompts";

export async function callLlama(userStats: any) {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) throw new Error("GROK_API_KEY is missing");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify(userStats) },
      ],
      response_format: { type: "json_object" }, 
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(`LLM Error: ${JSON.stringify(data)}`);

  const result = JSON.parse(data.choices[0].message.content);

  return {
    review_text: result.review_text,
    targets_set: result.targets_set,
    roy_factor_update: result.roy_factor_update || 0,
    model_used: "llama-3.3-70b",
    prompt_tokens: data.usage.prompt_tokens
  };
}
