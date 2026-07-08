import mongoose from 'mongoose';

// ------------------------------------------------------------------
// LEARNING NOTE: What is this file?
// This is a Mongoose "Schema". Think of it as a blueprint for a
// "Notification" object in our MongoDB database. 
// It tells the database exactly what fields are allowed and required.
// ------------------------------------------------------------------

const NotificationSchema = new mongoose.Schema({
  // Who is receiving this notification? We link it to their Supabase user ID.
  userId: { 
    type: String, 
    required: true 
  },
  
  // The actual text message (e.g., "Your post was approved!")
  message: { 
    type: String, 
    required: true 
  },
  
  // The type of notification determines its color/icon on the frontend.
  // We use an "enum" (enumeration) to restrict it to only these three values.
  type: { 
    type: String, 
    enum: ['success', 'error', 'info'], 
    default: 'info' 
  },
  
  // Has the user seen this yet? Defaults to false.
  isRead: { 
    type: Boolean, 
    default: false 
  },

  // (Optional) We can link this notification to a specific document.
  // For example, clicking the notification takes them to their rejected draft.
  relatedDocumentId: {
    type: String,
    required: false
  }

}, { 
  // This automatically adds `createdAt` and `updatedAt` timestamps!
  timestamps: true 
});

// Next.js hot-reloading can cause Mongoose to crash if it tries to register
// the same model twice. This line says: "If the model already exists, use it. 
// Otherwise, create a new one."
export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
