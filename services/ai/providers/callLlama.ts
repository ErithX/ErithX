import { SYSTEM_PROMPT } from "../prompts";

export async function callLlama(userStats: any) {
  const primaryKey = process.env.GROK_API_KEY;
  const fallbackKey = process.env.GROQ_FALLBACK_KEY;
  
  if (!primaryKey && !fallbackKey) throw new Error("GROK_API_KEY and GROQ_FALLBACK_KEY are missing");

  const keysToTry = [primaryKey, fallbackKey].filter(Boolean);
  let lastError;
  let responseData;

  for (const apiKey of keysToTry) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: JSON.stringify(userStats) },
          ],
          response_format: { type: "json_object" }, 
          temperature: 0.7,
        }),
      });

      responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(`LLM Error: ${JSON.stringify(responseData)}`);
      }
      
      // If we got here, it succeeded, break out of loop
      break;
    } catch (err: any) {
      lastError = err;
      responseData = null; // Clear responseData so we know it failed
    }
  }

  if (!responseData) {
    throw lastError || new Error("All Groq API keys failed");
  }

  const result = JSON.parse(responseData.choices[0].message.content);

  return {
    review_text: result.review_text,
    hidden_summary: result.hidden_summary,
    targets_set: result.targets_set,
    roy_factor_update: result.roy_factor_update || 0,
    model_used: "gpt-oss-120b",
    prompt_tokens: responseData.usage.prompt_tokens
  };
}
