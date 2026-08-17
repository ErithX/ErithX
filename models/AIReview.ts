import mongoose, { Schema, Document } from "mongoose";

export interface IAIReview extends Document {
  user_id: string;
  generated_text: string;
  targets_set: string;
  hidden_summary?: string;
  previous_targets?: string;
  model_used: string;
  prompt_tokens_used?: number;
  is_roadmap: boolean;
  roy_factor: number;
  stats_snapshot?: Record<string, any>;
  admin_note?: string;
  week_start_date?: Date;
  email_sent: boolean;
  email_sent_at?: Date;
  created_at: Date;
}

const AIReviewSchema = new Schema<IAIReview>({
  user_id: { type: String, required: true, index: true },
  generated_text: { type: String, required: true },
  targets_set: { type: String, required: true },
  hidden_summary: { type: String },
  previous_targets: { type: String },
  model_used: { type: String, required: true },
  prompt_tokens_used: { type: Number },
  is_roadmap: { type: Boolean, default: false },
  roy_factor: { type: Number, default: 0 },
  stats_snapshot: { type: Schema.Types.Mixed },
  admin_note: { type: String },
  week_start_date: { type: Date, index: true },
  email_sent: { type: Boolean, default: false },
  email_sent_at: { type: Date },
  created_at: { type: Date, default: Date.now, index: true },
});

// Compound index for querying user's latest review efficiently
AIReviewSchema.index({ user_id: 1, created_at: -1 });

export default mongoose.models.AIReview || mongoose.model<IAIReview>("AIReview", AIReviewSchema);

