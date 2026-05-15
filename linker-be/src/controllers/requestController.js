import Request from '../models/Request.js';
import User from '../models/User.js';
import { createNotification } from './notificationController.js';

// GET /api/requests  — returns received (pending) + sent requests for current user
export const getRequests = async (req, res) => {
  try {
    const [received, sent] = await Promise.all([
      Request.find({ toUserId: req.user.id })
        .sort({ createdAt: -1 })
        .populate('fromUserId', 'name email'),
      Request.find({ fromUserId: req.user.id })
        .sort({ createdAt: -1 })
        .populate('toUserId', 'name email'),
    ]);

    return res.json({ success: true, data: { received, sent }, message: 'Requests fetched' });
  } catch (err) {
    console.error('getRequests error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// POST /api/requests  — send a request by email
export const sendRequest = async (req, res) => {
  try {
    const { email, note } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, data: null, message: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid email format' });
    }

    const toUser = await User.findOne({ email: email.toLowerCase() }).select('_id name email');
    if (!toUser) {
      return res.status(404).json({ success: false, data: null, message: 'No user found with that email' });
    }

    if (toUser._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, data: null, message: 'You cannot send a request to yourself' });
    }

    const fromUser = await User.findById(req.user.id).select('name');

    // Upsert — if already exists, return existing; otherwise create
    const existing = await Request.findOne({
      fromUserId: req.user.id,
      toUserId: toUser._id,
    });

    if (existing) {
      return res.status(409).json({ success: false, data: null, message: 'Request already sent to this user' });
    }

    const request = await Request.create({
      fromUserId: req.user.id,
      toUserId: toUser._id,
      note: note?.trim() || '',
    });

    // Notify the recipient
    await createNotification({
      userId: toUser._id,
      type: 'request_received',
      title: `${fromUser.name} sent you a request`,
      body: note?.trim()
        ? `"${note.trim()}" — tap to view requests.`
        : 'Tap to view requests.',
      meta: { requestId: request._id, fromUserId: req.user.id },
    });

    return res.status(201).json({ success: true, data: request, message: 'Request sent' });
  } catch (err) {
    console.error('sendRequest error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// PATCH /api/requests/:id  — accept or reject
export const respondRequest = async (req, res) => {
  try {
    const { action } = req.body; // 'accepted' | 'rejected'
    if (!['accepted', 'rejected'].includes(action)) {
      return res.status(400).json({ success: false, data: null, message: 'Action must be accepted or rejected' });
    }

    const request = await Request.findOne({ _id: req.params.id, toUserId: req.user.id });
    if (!request) {
      return res.status(404).json({ success: false, data: null, message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, data: null, message: 'Request already responded to' });
    }

    request.status = action;
    await request.save();

    const respondingUser = await User.findById(req.user.id).select('name');

    // Notify the sender
    if (action === 'accepted') {
      await createNotification({
        userId: request.fromUserId,
        type: 'request_accepted',
        title: `${respondingUser.name} accepted your request`,
        body: 'You are now connected.',
        meta: { requestId: request._id, fromUserId: req.user.id },
      });
    } else {
      await createNotification({
        userId: request.fromUserId,
        type: 'request_rejected',
        title: `${respondingUser.name} declined your request`,
        body: 'Your connection request was declined.',
        meta: { requestId: request._id, fromUserId: req.user.id },
      });
    }

    return res.json({ success: true, data: request, message: `Request ${action}` });
  } catch (err) {
    console.error('respondRequest error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// DELETE /api/requests/:id  — cancel a sent request
export const cancelRequest = async (req, res) => {
  try {
    await Request.findOneAndDelete({ _id: req.params.id, fromUserId: req.user.id, status: 'pending' });
    return res.json({ success: true, data: null, message: 'Request cancelled' });
  } catch (err) {
    console.error('cancelRequest error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};
