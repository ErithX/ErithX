import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBugReport extends Document {
  user_id: string;
  email?: string;
  message: string;
  page: string;
  status: "open" | "resolved";
  createdAt: Date;
}

const BugReportSchema: Schema<IBugReport> = new Schema(
  {
    user_id: { type: String, required: true },
    email: { type: String },
    message: { type: String, required: true },
    page: { type: String },
    status: { type: String, enum: ["open", "resolved"], default: "open" },
  },
  { timestamps: true }
);

export const BugReport: Model<IBugReport> =
  mongoose.models.BugReport || mongoose.model<IBugReport>("BugReport", BugReportSchema);
