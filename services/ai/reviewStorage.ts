import connectToDatabase from "@/app/lib/mongodb";
import AIReview, { IAIReview } from "@/models/AIReview";

export interface SaveReviewParams {
  userId: string;
  reviewText: string;
  hiddenSummary?: string;
  targetsSet: string;
  previousTargets?: string;
  royFactorUpdate?: number;
  currentRoyFactor?: number;
  modelUsed: string;
  promptTokensUsed?: number;
  isRoadmap?: boolean;
  statsSnapshot?: Record<string, any>;
  adminNote?: string;
  weekStartDate?: Date;
}

/**
 * Saves a newly generated AI Review to MongoDB.
 * Calculates updated roy_factor based on LLM response.
 */
export async function saveAIReview(params: SaveReviewParams): Promise<IAIReview> {
  await connectToDatabase();

  const currentRoy = params.currentRoyFactor ?? 0;
  const updateDelta = params.royFactorUpdate ?? 0;
  // Calculate new roy_factor (clamped at minimum 0)
  const newRoyFactor = Math.max(0, currentRoy + updateDelta);

  const review = await AIReview.create({
    user_id: params.userId,
    generated_text: params.reviewText,
    targets_set: params.targetsSet,
    hidden_summary: params.hiddenSummary,
    previous_targets: params.previousTargets,
    model_used: params.modelUsed,
    prompt_tokens_used: params.promptTokensUsed,
    is_roadmap: params.isRoadmap ?? false,
    roy_factor: newRoyFactor,
    stats_snapshot: params.statsSnapshot,
    admin_note: params.adminNote,
    week_start_date: params.weekStartDate || new Date(),
    email_sent: false,
    created_at: new Date(),
  });

  return review;
}

/**
 * Retrieves the latest AI Review for a user.
 * Used for feeding previous targets & roy_factor into the next prompt.
 */
export async function getLatestUserReview(userId: string): Promise<IAIReview | null> {
  await connectToDatabase();

  const latest = await AIReview.findOne({ user_id: userId })
    .sort({ created_at: -1 })
    .lean<IAIReview>();

  return latest;
}

/**
 * Retrieves historical AI Reviews for a user.
 * Used for user dashboard timeline and multi-week trend comparisons.
 */
export async function getUserReviewHistory(userId: string, limit = 10): Promise<IAIReview[]> {
  await connectToDatabase();

  const history = await AIReview.find({ user_id: userId })
    .sort({ created_at: -1 })
    .limit(limit)
    .lean<IAIReview[]>();

  return history;
}

/**
 * Marks a review's email delivery status.
 */
export async function markReviewEmailSent(reviewId: string): Promise<boolean> {
  await connectToDatabase();

  const result = await AIReview.findByIdAndUpdate(reviewId, {
    email_sent: true,
    email_sent_at: new Date(),
  });

  return !!result;
}
