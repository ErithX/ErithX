/**
 * trendAnalyzer.ts
 * 
 * Generic, platform-agnostic trend computation service.
 * Takes history arrays and computes delta/absolute arrays for the LLM.
 * 
 * Design principle: This service does ONLY math. It has zero knowledge
 * of the LLM, the frontend, or any specific platform's business logic.
 * Adding a new platform = one function call with different field mappings.
 */

export interface TrendResult {
  [fieldName: string]: number[];
}

/**
 * Computes multi-week trend data from a history array.
 * 
 * @param history - Array of snapshot objects, sorted oldest-first (chronological)
 * @param deltaFields - Map of { outputName: historyFieldName } for week-over-week CHANGE
 *                       (e.g., totalSolved → how many new problems they solved each week)
 * @param absoluteFields - Map of { outputName: historyFieldName } for raw values at each point
 *                          (e.g., contestRating → the rating itself, not the delta)
 * @param windowSize - How many weeks of deltas to return (default 3)
 * @returns TrendResult object with arrays, or null if insufficient data
 * 
 * Example:
 *   history = [
 *     { totalSolved: 100, contestRating: 1400 },
 *     { totalSolved: 108, contestRating: 1420 },
 *     { totalSolved: 122, contestRating: 1455 },
 *     { totalSolved: 127, contestRating: 1440 }
 *   ]
 *   computeTrend(history, { solves_per_week: 'totalSolved' }, { rating_per_week: 'contestRating' })
 *   → { solves_per_week: [8, 14, 5], rating_per_week: [1420, 1455, 1440] }
 *
 *   The LLM sees [8, 14, 5] and writes: "Two weeks ago you had your best week — 14 solves.
 *   This week you dropped to 5. That's not a plateau, that's a relapse."
 */
export function computeTrend(
  history: any[],
  deltaFields: Record<string, string>,
  absoluteFields: Record<string, string>,
  windowSize: number = 3
): TrendResult | null {
  if (!history || history.length < 2) return null;

  // Adjust window if we have fewer data points than requested
  const effectiveWindow = Math.min(windowSize, history.length - 1);
  const recent = history.slice(-(effectiveWindow + 1));
  const result: TrendResult = {};

  // Compute deltas (week-over-week change, floored at 0)
  for (const [outputName, fieldName] of Object.entries(deltaFields)) {
    const deltas: number[] = [];
    for (let i = 1; i < recent.length; i++) {
      deltas.push(Math.max(0, (recent[i][fieldName] || 0) - (recent[i - 1][fieldName] || 0)));
    }
    result[outputName] = deltas;
  }

  // Absolute values (raw snapshot values, aligned with delta windows)
  for (const [outputName, fieldName] of Object.entries(absoluteFields)) {
    result[outputName] = recent.slice(1).map((h: any) => h[fieldName] || 0);
  }

  return result;
}
