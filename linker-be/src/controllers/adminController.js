import User from '../models/User.js';

// GET /api/admin/users?search=&page=1&limit=10
export const listUsers = async (req, res) => {
  const { search = '', page = 1, limit = 10 } = req.query;

  const baseFilter = { role: { $ne: 'admin' } };

  const query = search.trim()
    ? {
        ...baseFilter,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }
    : baseFilter;

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit)),
    User.countDocuments(query),
  ]);

  return res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    },
    message: 'Users fetched successfully',
  });
};

// PATCH /api/admin/users/:id/ban
export const toggleBan = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return res.status(404).json({ success: false, data: null, message: 'User not found' });
  }
  if (user.role === 'admin') {
    return res.status(403).json({ success: false, data: null, message: 'Cannot ban an admin account' });
  }

  user.isBanned = !user.isBanned;
  await user.save();

  return res.status(200).json({
    success: true,
    data: { user },
    message: user.isBanned ? 'User banned successfully' : 'User unbanned successfully',
  });
};
