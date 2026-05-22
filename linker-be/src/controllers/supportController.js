import SupportTicket from '../models/SupportTicket.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// POST /api/support  — submit a ticket (any authenticated user)
export const createTicket = async (req, res) => {
  try {
    const { title, description, priority, workspace } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ success: false, data: null, message: 'Title is required' });
    }
    if (!description?.trim()) {
      return res.status(400).json({ success: false, data: null, message: 'Description is required' });
    }

    const ticket = await SupportTicket.create({
      title: title.trim(),
      description: description.trim(),
      priority: priority || 'medium',
      workspace: ['personal', 'professional'].includes(workspace) ? workspace : 'personal',
      userId: req.user.id,
    });
    // Notify all admin users about the new ticket
    const admins = await User.find({ role: 'admin' }, '_id').lean();
    if (admins.length > 0) {
      await Notification.insertMany(
        admins.map((admin) => ({
          userId: admin._id,
          type: 'support_ticket',
          context: 'admin',
          title: 'New Support Ticket',
          body: `"${ticket.title}" was submitted and needs attention.`,
          meta: { fromUserId: req.user.id },
        }))
      );
    }
    return res.status(201).json({ success: true, data: ticket, message: 'Ticket submitted' });
  } catch (err) {
    console.error('createTicket error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// GET /api/support/mine  — get current user's own tickets
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, data: tickets, message: 'Tickets fetched' });
  } catch (err) {
    console.error('getMyTickets error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// GET /api/support/admin  — admin: get all tickets with user info
export const adminGetAllTickets = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const skip = (Number(page) - 1) * Number(limit);
    const [tickets, total] = await Promise.all([
      SupportTicket.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('userId', 'name email'),
      SupportTicket.countDocuments(filter),
    ]);

    return res.json({ success: true, data: { tickets, total }, message: 'Tickets fetched' });
  } catch (err) {
    console.error('adminGetAllTickets error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// PATCH /api/support/admin/:id  — admin: update status / adminNote
export const adminUpdateTicket = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const allowed = ['open', 'in-progress', 'resolved'];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid status' });
    }

    const update = {};
    if (status) update.status = status;
    if (adminNote !== undefined) update.adminNote = adminNote.trim();

    const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, update, { new: true }).populate('userId', 'name email');
    if (!ticket) {
      return res.status(404).json({ success: false, data: null, message: 'Ticket not found' });
    }

    return res.json({ success: true, data: ticket, message: 'Ticket updated' });
  } catch (err) {
    console.error('adminUpdateTicket error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};
