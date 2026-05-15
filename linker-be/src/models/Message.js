import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUserId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content:    { type: String, required: true, trim: true, maxlength: 2000 },
    read:       { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Fast lookup of a conversation between two users
messageSchema.index({ fromUserId: 1, toUserId: 1, createdAt: -1 });
messageSchema.index({ toUserId: 1, fromUserId: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);
