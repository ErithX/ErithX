export const BANNED_WORDS = [
  "B.Tech",
  "PYQ",
  "placement",
  "crack the interview",
  "keep grinding",
  "you got this",
  "amazing work",
  "proud of you",
  "journey",
  "consistency is key",
  "dormant",
  "trajectory",
  "commendable",
  "noteworthy",
  "stagnant",
  "declining"
] as const;

const BANNED_REPLACEMENTS: Record<string, string> = {
  "B.Tech": "undergrad",
  "PYQ": "previous papers",
  "placement": "job hunt",
  "crack the interview": "ace the interview",
  "keep grinding": "keep pushing forward",
  "you got this": "stay on it",
  "amazing work": "nice work",
  "proud of you": "well done",
  "journey": "process",
  "consistency is key": "showing up regularly matters",
  "dormant": "inactive",
  "trajectory": "path",
  "commendable": "solid",
  "noteworthy": "noticeable",
  "stagnant": "stuck",
  
};

/**
 * Post-processing safety net (Bug 5 fix).
 * Not all models self-censor equally, so we strip the banned words from the
 * final review text before it is stored. Case-insensitive, word-boundary safe.
 * Returns the sanitized text and whether anything was replaced.
 */
export function sanitizeBannedWords(text: string): { text: string; replaced: boolean } {
  if (!text) return { text: text || "", replaced: false };

  let replaced = false;
  let sanitized = text;

  for (const banned of BANNED_WORDS) {
    const escaped = banned.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped.replace(/\s+/g, "\\s+")}\\b`, "gi");
    const replacement = BANNED_REPLACEMENTS[banned] ?? "—";
    if (regex.test(sanitized)) {
      replaced = true;
    }
    sanitized = sanitized.replace(regex, replacement);
  }

  return { text: sanitized, replaced };
}