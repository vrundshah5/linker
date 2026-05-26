import mongoose from 'mongoose';

const mentionSchema = new mongoose.Schema(
  {
    toUserId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User',           required: true },
    fromUserId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User',           required: true },
    projectId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Project',        required: true },
    messageId:   { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectMessage', required: true },
    messageText: { type: String, required: true, maxlength: 500 },
    read:        { type: Boolean, default: false },
  },
  { timestamps: true }
);

mentionSchema.index({ toUserId: 1, createdAt: -1 });

export default mongoose.model('Mention', mentionSchema);
