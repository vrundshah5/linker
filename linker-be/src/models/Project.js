import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['admin', 'member'], default: 'member' },
      },
    ],
    invites: [
      {
        userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status:    { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
        invitedAt: { type: Date, default: Date.now },
      },
    ],
    color: { type: String, default: '#f59e0b' },
    iconUrl: { type: String, default: '' },
    permissions: {
      anyoneCanInvite:      { type: Boolean, default: false },
      anyoneCanAddResources:{ type: Boolean, default: true  },
    },
  },
  { timestamps: true }
);

projectSchema.index({ ownerId: 1 });
projectSchema.index({ 'members.userId': 1 });

export default mongoose.model('Project', projectSchema);
