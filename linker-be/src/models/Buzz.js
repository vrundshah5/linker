import mongoose from 'mongoose';

const buzzSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUserId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    read:       { type: Boolean, default: false },
  },
  { timestamps: true }
);

buzzSchema.index({ toUserId: 1, createdAt: -1 });

export default mongoose.model('Buzz', buzzSchema);
