import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  resourceId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorImg: {
    type: String
  },
  content: {
    type: String,
    required: true
  },
  upvotes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Avoid OverwriteModelError in Next.js HMR
const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export default Comment;
