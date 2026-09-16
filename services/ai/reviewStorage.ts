import connectToDatabase from "@/app/lib/mongodb";
import AIReview, { IAIReview } from "@/models/AIReview";
import { sanitizeBannedWords } from "./sanitize";

export interface SaveReviewParams {
  userId: string;
  reviewText: string;
  hiddenSummary?: string;
  targetsSet: string;
  monthlyRoadmap?: string;
  previousTargets?: string;
  royFactor?: number;
  modelUsed: string;
  promptTokensUsed?: number;
  isRoadmap?: boolean;
  statsSnapshot?: Record<string, any>;
  adminNote?: string;
  weekStartDate?: Date;
}

/**
 * Saves a newly generated AI Review to MongoDB.
 * The roy_factor is decided by the LLM (absolute value, not a delta) and stored
 * as-is. Only a sanity clamp [0..5] is applied — no deterministic re-calculation
 * of the LLM's judgment. The review text is post-filtered against banned words
 * as a safety net for models that don't self-censor perfectly.
 */
export async function saveAIReview(params: SaveReviewParams): Promise<IAIReview> {
  await connectToDatabase();

  const rawRoy = params.royFactor ?? 0;
  const roy = Math.min(5, Math.max(0, Math.round(rawRoy)));

  const sanitized = sanitizeBannedWords(params.reviewText);

  const review = await AIReview.create({
    user_id: params.userId,
    generated_text: sanitized.text,
    targets_set: params.targetsSet,
    monthly_roadmap: params.monthlyRoadmap,
    hidden_summary: params.hiddenSummary,
    previous_targets: params.previousTargets,
    model_used: params.modelUsed,
    prompt_tokens_used: params.promptTokensUsed,
    is_roadmap: params.isRoadmap ?? false,
    roy_factor: roy,
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
 * Gets the total number of reviews a user has received.
 */
export async function getUserReviewCount(userId: string): Promise<number> {
  await connectToDatabase();
  return await AIReview.countDocuments({ user_id: userId });
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
