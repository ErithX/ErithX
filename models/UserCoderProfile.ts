import mongoose, { Schema, Document } from 'mongoose';

export interface IPlatformProfile {
  handle: string;
  url: string;
  verified: boolean;
  lastVerifiedAt?: Date;
  avatar?: string;
  displayName?: string;
  statsSummary?: Record<string, any>;
}

export interface IUserCoderProfile extends Document {
  userId: string;
  userEmail?: string;
  platforms: {
    leetcode?: IPlatformProfile;
    github?: IPlatformProfile;
    codeforces?: IPlatformProfile;
  };
  otherUrls: string[];
  pendingAdminNote?: string;
  lastSnapshotAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PlatformProfileSchema = new Schema({
  handle: { type: String, trim: true },
  url: { type: String, trim: true },
  verified: { type: Boolean, default: false },
  lastVerifiedAt: { type: Date, default: Date.now },
  avatar: { type: String, default: '' },
  displayName: { type: String, default: '' },
  statsSummary: { type: Schema.Types.Mixed, default: {} }
}, { _id: false });

const UserCoderProfileSchema = new Schema<IUserCoderProfile>({
  userId: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  userEmail: { 
    type: String, 
    trim: true, 
    lowercase: true 
  },
  platforms: {
    leetcode: { type: PlatformProfileSchema, default: null },
    github: { type: PlatformProfileSchema, default: null },
    codeforces: { type: PlatformProfileSchema, default: null }
  },
  otherUrls: { type: [String], default: [] },
  pendingAdminNote: { type: String, trim: true, default: '' },
  lastSnapshotAt: { type: Date }
}, { timestamps: true });

export const UserCoderProfile = mongoose.models.UserCoderProfile || mongoose.model<IUserCoderProfile>('UserCoderProfile', UserCoderProfileSchema);
