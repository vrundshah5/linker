import Mention from '../models/Mention.js';
import Buzz from '../models/Buzz.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import { broadcastNotification } from '../lib/supabase.js';

// GET /api/mention-buzz/unread
export const getUnreadCounts = async (req, res) => {
  try {
    const [mentionCount, buzzCount] = await Promise.all([
      Mention.countDocuments({ toUserId: req.user.id, read: false }),
      Buzz.countDocuments({ toUserId: req.user.id, read: false }),
    ]);
    return res.json({ success: true, data: { mentions: mentionCount, buzzes: buzzCount } });
  } catch (err) {
    console.error('getUnreadCounts error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// GET /api/mention-buzz/mentions
export const getMentions = async (req, res) => {
  try {
    const mentions = await Mention.find({ toUserId: req.user.id })
      .populate('fromUserId', 'name email')
      .populate('projectId', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
    return res.json({ success: true, data: mentions });
  } catch (err) {
    console.error('getMentions error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// PATCH /api/mention-buzz/mentions/read
export const markMentionsRead = async (req, res) => {
  try {
    await Mention.updateMany({ toUserId: req.user.id, read: false }, { read: true });
    return res.json({ success: true, data: null, message: 'Mentions marked as read' });
  } catch (err) {
    console.error('markMentionsRead error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// GET /api/mention-buzz/buzzes
export const getBuzzes = async (req, res) => {
  try {
    const buzzes = await Buzz.find({ toUserId: req.user.id })
      .populate('fromUserId', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);
    return res.json({ success: true, data: buzzes });
  } catch (err) {
    console.error('getBuzzes error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// PATCH /api/mention-buzz/buzzes/read
export const markBuzzesRead = async (req, res) => {
  try {
    await Buzz.updateMany({ toUserId: req.user.id, read: false }, { read: true });
    return res.json({ success: true, data: null, message: 'Buzzes marked as read' });
  } catch (err) {
    console.error('markBuzzesRead error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// POST /api/mention-buzz/buzz  — send a buzz to another user
export const sendBuzz = async (req, res) => {
  try {
    const { toUserId } = req.body;

    if (!toUserId) {
      return res.status(400).json({ success: false, data: null, message: 'toUserId is required' });
    }

    if (toUserId.toString() === req.user.id.toString()) {
      return res.status(400).json({ success: false, data: null, message: 'You cannot buzz yourself' });
    }

    const target = await User.findById(toUserId).select('name email');
    if (!target) {
      return res.status(404).json({ success: false, data: null, message: 'User not found' });
    }

    const buzz = await Buzz.create({ fromUserId: req.user.id, toUserId });
    await buzz.populate('fromUserId', 'name email');

    // Broadcast live buzz alert to recipient
    await broadcastNotification(toUserId, {
      event: 'new_buzz',
      fromUserId: req.user.id.toString(),
    });

    return res.status(201).json({ success: true, data: buzz, message: `Buzzed ${target.name}!` });
  } catch (err) {
    console.error('sendBuzz error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// GET /api/mention-buzz/contacts — project members the user can buzz
export const getContacts = async (req, res) => {
  try {
    const myId = req.user.id;
    const projects = await Project.find({
      $or: [{ ownerId: myId }, { 'members.userId': myId }],
    })
      .populate('ownerId', 'name email')
      .populate('members.userId', 'name email');

    const seen = new Set();
    const contacts = [];

    for (const project of projects) {
      const owner = project.ownerId;
      if (owner && owner._id.toString() !== myId.toString() && !seen.has(owner._id.toString())) {
        seen.add(owner._id.toString());
        contacts.push({ _id: owner._id, name: owner.name, email: owner.email });
      }
      for (const m of project.members) {
        const mu = m.userId;
        if (mu && mu._id.toString() !== myId.toString() && !seen.has(mu._id.toString())) {
          seen.add(mu._id.toString());
          contacts.push({ _id: mu._id, name: mu.name, email: mu.email });
        }
      }
    }

    return res.json({ success: true, data: contacts });
  } catch (err) {
    console.error('getContacts error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};
