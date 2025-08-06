import mongoose from 'mongoose';

const SupportRequestSchema = new mongoose.Schema({
  topic: String,
  email: String,
  subject: String,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const SupportRequest =
  mongoose.models.SupportRequest || mongoose.model('SupportRequest', SupportRequestSchema);
