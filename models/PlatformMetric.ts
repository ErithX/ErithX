import mongoose from 'mongoose';

const PlatformMetricSchema = new mongoose.Schema({
  metricKey: {
    type: String, // e.g. 'contest_calendar_sync', 'contest_platform_click', 'pdf_download'
    required: true,
    unique: true
  },
  count: {
    type: Number,
    default: 0
  },
  platformBreakdown: {
    type: Map,
    of: Number,
    default: {}
  }
}, { timestamps: true });

export const PlatformMetric = mongoose.models.PlatformMetric || mongoose.model('PlatformMetric', PlatformMetricSchema);
