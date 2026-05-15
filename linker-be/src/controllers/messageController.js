import Message from '../models/Message.js';
import Request from '../models/Request.js';
import User from '../models/User.js';

/** Return the list of user IDs that the current user has an accepted connection with */
async function getConnectionIds(userId) {
  const accepted = await Request.find({
    status: 'accepted',
    $or: [{ fromUserId: userId }, { toUserId: userId }],
  }).select('fromUserId toUserId');

  return accepted.map((r) =>
    r.fromUserId.toString() === userId.toString()
      ? r.toUserId
      : r.fromUserId
  );
}

// GET /api/messages/conversations
// Returns all accepted connections with last message + unread count
export const getConversations = async (req, res) => {
  try {
    const myId = req.user.id;
    const connectionIds = await getConnectionIds(myId);

    if (connectionIds.length === 0) {
      return res.json({ success: true, data: [], message: 'No conversations' });
    }

    // Fetch user info + last message + unread count for each connection in parallel
    const conversations = await Promise.all(
      connectionIds.map(async (otherId) => {
        const [otherUser, lastMessage, unreadCount] = await Promise.all([
          User.findById(otherId).select('name email'),
          Message.findOne({
            $or: [
              { fromUserId: myId, toUserId: otherId },
              { fromUserId: otherId, toUserId: myId },
            ],
          })
            .sort({ createdAt: -1 })
            .select('content createdAt fromUserId read'),
          Message.countDocuments({
            fromUserId: otherId,
            toUserId: myId,
            read: false,
          }),
        ]);

        if (!otherUser) return null;

        return {
          userId: otherUser._id,
          name: otherUser.name,
          email: otherUser.email,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
                isFromMe: lastMessage.fromUserId.toString() === myId.toString(),
              }
            : null,
          unreadCount,
        };
      })
    );

    const result = conversations.filter(Boolean).sort((a, b) => {
      const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    return res.json({ success: true, data: result, message: 'Conversations fetched' });
  } catch (err) {
    console.error('getConversations error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// GET /api/messages/:userId
// Returns paginated messages between the current user and :userId
export const getMessages = async (req, res) => {
  try {
    const myId = req.user.id;
    const { userId } = req.params;

    if (!userId || userId.length !== 24) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid user ID' });
    }

    // Verify there is an accepted connection between the two users
    const connection = await Request.findOne({
      status: 'accepted',
      $or: [
        { fromUserId: myId, toUserId: userId },
        { fromUserId: userId, toUserId: myId },
      ],
    });

    if (!connection) {
      return res.status(403).json({ success: false, data: null, message: 'No accepted connection with this user' });
    }

    const page  = Math.max(1, parseInt(req.query.page  ?? '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit ?? '50', 10)));
    const skip  = (page - 1) * limit;

    const messages = await Message.find({
      $or: [
        { fromUserId: myId, toUserId: userId },
        { fromUserId: userId, toUserId: myId },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('fromUserId', 'name email')
      .lean();

    return res.json({
      success: true,
      data: messages.reverse(),
      message: 'Messages fetched',
    });
  } catch (err) {
    console.error('getMessages error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// POST /api/messages/:userId
// Send a message to :userId (must have accepted connection)
export const sendMessage = async (req, res) => {
  try {
    const myId = req.user.id;
    const { userId } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ success: false, data: null, message: 'Message content is required' });
    }

    if (content.trim().length > 2000) {
      return res.status(400).json({ success: false, data: null, message: 'Message too long (max 2000 characters)' });
    }

    if (!userId || userId.length !== 24) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid user ID' });
    }

    if (userId === myId.toString()) {
      return res.status(400).json({ success: false, data: null, message: 'Cannot send a message to yourself' });
    }

    // Verify accepted connection
    const connection = await Request.findOne({
      status: 'accepted',
      $or: [
        { fromUserId: myId, toUserId: userId },
        { fromUserId: userId, toUserId: myId },
      ],
    });

    if (!connection) {
      return res.status(403).json({ success: false, data: null, message: 'No accepted connection with this user' });
    }

    const message = await Message.create({
      fromUserId: myId,
      toUserId: userId,
      content: content.trim(),
    });

    await message.populate('fromUserId', 'name email');

    return res.status(201).json({ success: true, data: message, message: 'Message sent' });
  } catch (err) {
    console.error('sendMessage error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// PATCH /api/messages/:userId/read
// Mark all messages from :userId to current user as read
export const markRead = async (req, res) => {
  try {
    const myId = req.user.id;
    const { userId } = req.params;

    if (!userId || userId.length !== 24) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid user ID' });
    }

    await Message.updateMany(
      { fromUserId: userId, toUserId: myId, read: false },
      { $set: { read: true } }
    );

    return res.json({ success: true, data: null, message: 'Messages marked as read' });
  } catch (err) {
    console.error('markRead error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};
