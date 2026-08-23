import mongoose from 'mongoose';

const SystemLogSchema = new mongoose.Schema({
    level: { type: String, enum: ['info', 'warning', 'error'], default: 'info' },
    source: { type: String, required: true }, // e.g., 'cron-generate-reviews'
    message: { type: String, required: true },
    meta: { type: mongoose.Schema.Types.Mixed }, // Any additional JSON data
}, { timestamps: true });

export const SystemLog = mongoose.models.SystemLog || mongoose.model('SystemLog', SystemLogSchema);
