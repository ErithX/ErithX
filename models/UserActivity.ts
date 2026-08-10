import mongoose from 'mongoose';

const UserActivitySchema = new mongoose.Schema({
  userId: { 
    type: String, 
    default: null 
  },
  userEmail: { 
    type: String, 
    default: 'Guest User' 
  },
  userName: { 
    type: String, 
    default: 'Guest Coder' 
  },
  userAvatar: { 
    type: String, 
    default: '' 
  },
  type: { 
    type: String, 
    enum: ['contest_calendar_sync', 'contest_platform_click', 'pdf_download'],
    required: true 
  },
  title: { 
    type: String, 
    default: '' 
  },
  platform: { 
    type: String, 
    default: '' 
  },
  resourceId: { 
    type: String, 
    default: '' 
  },
}, { timestamps: true });

UserActivitySchema.index({ createdAt: -1 });

export const UserActivity = mongoose.models.UserActivity || mongoose.model('UserActivity', UserActivitySchema);
