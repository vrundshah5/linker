import Notification from '../models/Notification.js';
import { broadcastNotification } from '../lib/supabase.js';

// GET /api/notifications?context=personal|professional
export const getNotifications = async (req, res) => {
  try {
    const filter = { userId: req.user.id };
    if (req.query.context && ['personal', 'professional', 'admin'].includes(req.query.context)) {
      filter.context = req.query.context;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('meta.fromUserId', 'name email avatar');

    return res.json({ success: true, data: notifications, message: 'Notifications fetched' });
  } catch (err) {
    console.error('getNotifications error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// PATCH /api/notifications/read-all?context=personal|professional
export const markAllRead = async (req, res) => {
  try {
    const filter = { userId: req.user.id, read: false };
    if (req.query.context && ['personal', 'professional', 'admin'].includes(req.query.context)) {
      filter.context = req.query.context;
    }
    await Notification.updateMany(filter, { read: true });
    return res.json({ success: true, data: null, message: 'All marked as read' });
  } catch (err) {
    console.error('markAllRead error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// PATCH /api/notifications/:id/read
export const markOneRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true }
    );
    return res.json({ success: true, data: null, message: 'Marked as read' });
  } catch (err) {
    console.error('markOneRead error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// DELETE /api/notifications/:id
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    return res.json({ success: true, data: null, message: 'Deleted' });
  } catch (err) {
    console.error('deleteNotification error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// Helper — create a notification (called internally from other controllers)
export const createNotification = async ({ userId, type, title, body, meta = {}, context = 'personal' }) => {
  const notification = await Notification.create({ userId, type, title, body, meta, context });
  // Push live update to the user's Realtime channel
  await broadcastNotification(`notifications:${userId}`, 'new_notification', {
    id: notification._id.toString(),
    type,
    context,
    title,
    body,
  });
  return notification;
};
