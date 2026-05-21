import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['new_user', 'request_received', 'request_accepted', 'request_rejected', 'project_invite'],
      required: true,
    },
    context: {
      type: String,
      enum: ['personal', 'professional'],
      default: 'personal',
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    read: { type: Boolean, default: false },
    meta: {
      requestId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Request', default: null },
      fromUserId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User',    default: null },
      projectId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
      actorName:   { type: String, default: null },
      projectName: { type: String, default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
