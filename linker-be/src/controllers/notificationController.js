import Notification from '../models/Notification.js';

// GET /api/notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('meta.fromUserId', 'name email');

    return res.json({ success: true, data: notifications, message: 'Notifications fetched' });
  } catch (err) {
    console.error('getNotifications error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// PATCH /api/notifications/read-all
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
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
export const createNotification = async ({ userId, type, title, body, meta = {} }) => {
  return Notification.create({ userId, type, title, body, meta });
};
