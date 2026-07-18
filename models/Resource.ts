import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  },
  authorName: {
    type: String,
    default: 'Anonymous'
  },
  authorEmail: {
    type: String,
    default: ''
  },
  authorImg: {
    type: String,
    default: '' // Use actual URL from user metadata
  },
  isPro: {
    type: Boolean,
    default: false
  },
  title: { 
    type: String, 
    default: 'Untitled' 
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  content: { 
    type: String, 
    default: '' 
  },
  mediaAssets: [{ 
    type: String 
  }],
  category: { 
    type: String, 
    enum: ['Blogs', 'Study Materials', 'Career'],
    default: 'Blogs'
  },
  tags: [{ 
    type: String 
  }],
  coverImage: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['draft', 'pending', 'published', 'rejected'],
    default: 'draft'
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  wordCount: {
    type: Number,
    default: 0
  },
  upvotes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  realViews: {
    type: Number,
    default: 0
  },
  upvotedBy: {
    type: [String],
    default: []
  },
  commentsCount: {
    type: Number,
    default: 0
  },
 
}, { timestamps: true });

// Prevent mongoose from recompiling the model upon hot reload
export const Resource = mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);
