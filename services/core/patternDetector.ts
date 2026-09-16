import AIReview from '@/models/AIReview';
import connectToDatabase from '@/app/lib/mongodb';

interface ComplianceEntry {
  week: string;
  targets_given: string;
  roy_factor_at_time: number;
}

export interface PatternResult {
  weeks_of_data: number;
  compliance_trajectory: ComplianceEntry[];
  all_past_targets: string[];
}

/**
 * Analyzes the user's last N AI Reviews to surface recurring patterns.
 * 
 * Returns raw, structured data — NOT pre-computed conclusions.
 * The LLM interprets this data and discovers narratives on its own.
 * 
 * Example output:
 * {
 *   weeks_of_data: 4,
 *   compliance_trajectory: [
 *     { week: "2026-08-24", targets_given: "Solve 5 Graph Mediums", roy_factor_at_time: 0 },
 *     { week: "2026-08-31", targets_given: "Solve 5 Graph Mediums", roy_factor_at_time: 1 },
 *     { week: "2026-09-07", targets_given: "Start with 3 Easy Graphs", roy_factor_at_time: 2 }
 *   ],
 *   all_past_targets: ["Solve 5 Graph Mediums", "Solve 5 Graph Mediums", "Start with 3 Easy Graphs"]
 * }
 *
 * The LLM can then say: "I've been asking you to work on Graphs for 3 weeks now.
 * Your ignoring streak went from 0 to 2. At this point I think you're avoiding them."
 */
export async function detectPatterns(userId: string, lookbackCount: number = 4): Promise<PatternResult | null> {
  await connectToDatabase();

  const pastReviews = await AIReview.find({ user_id: userId })
    .sort({ created_at: -1 })
    .limit(lookbackCount)
    .select('created_at targets_set roy_factor')
    .lean();

  if (!pastReviews || pastReviews.length < 2) return null;

  // Reverse to chronological order (oldest first)
  const reviews = pastReviews.reverse();

  const complianceTrajectory: ComplianceEntry[] = reviews.map((r: any) => ({
    week: new Date(r.created_at).toISOString().slice(0, 10),
    targets_given: r.targets_set || "No targets set",
    roy_factor_at_time: r.roy_factor ?? 0
  }));

  const allPastTargets = reviews
    .map((r: any) => r.targets_set)
    .filter(Boolean);

  return {
    weeks_of_data: reviews.length,
    compliance_trajectory: complianceTrajectory,
    all_past_targets: allPastTargets
  };
}
