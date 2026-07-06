import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    default: 'Untitled' 
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
    enum: ['blog', 'notes', 'diagram'],
    default: 'blog'
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
  wordCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Prevent mongoose from recompiling the model upon hot reload
export const Resource = mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);
