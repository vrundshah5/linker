import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    adminNote: { type: String, default: '', maxlength: 1000 },
    workspace: {
      type: String,
      enum: ['personal', 'professional'],
      default: 'personal',
    },
  },
  { timestamps: true }
);

export default mongoose.model('SupportTicket', supportTicketSchema);
