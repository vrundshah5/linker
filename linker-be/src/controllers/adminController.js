import User from '../models/User.js';
import GlobalCategory from '../models/GlobalCategory.js';
import UserCategory from '../models/UserCategory.js';
import Link from '../models/Link.js';
import Project from '../models/Project.js';
import Notification from '../models/Notification.js';

// GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const [totalUsers, totalCategories, totalLinks, activeGlobalCategories, workspacesAgg] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      UserCategory.countDocuments(),
      Link.countDocuments(),
      GlobalCategory.countDocuments({ isActive: true }),
      User.aggregate([
        { $match: { role: { $ne: 'admin' } } },
        { $project: { workspaceCount: { $size: { $ifNull: ['$workspaces', []] } } } },
        { $group: { _id: null, total: { $sum: '$workspaceCount' } } },
      ]),
    ]);

    const totalWorkspaces = workspacesAgg[0]?.total ?? 0;

    // User registrations per month for the last 7 months
    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 6);
    sevenMonthsAgo.setDate(1);
    sevenMonthsAgo.setHours(0, 0, 0, 0);

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sevenMonthsAgo }, role: { $ne: 'admin' } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Fill in missing months with 0
    const months = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const match = userGrowth.find(
        (g) => g._id.year === d.getFullYear() && g._id.month === d.getMonth() + 1
      );
      months.push({ month: MONTH_NAMES[d.getMonth()], count: match?.count ?? 0 });
    }

    // Top 5 categories by total link count across all users
    const topCategories = await UserCategory.aggregate([
      {
        $group: {
          _id: '$name',
          totalLinks: { $sum: '$linkCount' },
          userCount: { $sum: 1 },
        },
      },
      { $sort: { totalLinks: -1 } },
      { $limit: 5 },
    ]);

    const maxLinks = topCategories[0]?.totalLinks ?? 1;

    const categoryDistribution = topCategories.map((c) => ({
      name: c._id,
      count: c.totalLinks,
      pct: Math.round((c.totalLinks / maxLinks) * 100),
    }));

    return res.json({
      success: true,
      data: {
        totalUsers,
        totalWorkspaces,
        totalCategories,
        totalLinks,
        activeGlobalCategories,
        userGrowth: months,
        categoryDistribution,
      },
      message: 'Stats fetched',
    });
  } catch (err) {
    console.error('getStats error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

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

// GET /api/admin/users/:id
// Returns a single user + their custom (non-global) categories
export const getUserDetail = async (req, res) => {
  const user = await User.findById(req.params.id).select(
    '-password -resetPasswordToken -resetPasswordExpires'
  );
  if (!user) {
    return res.status(404).json({ success: false, data: null, message: 'User not found' });
  }

  const [customCategories, projects] = await Promise.all([
    UserCategory.find({ userId: req.params.id, isGlobal: false }).sort({ createdAt: -1 }),
    Project.find({
      $or: [{ ownerId: req.params.id }, { 'members.userId': req.params.id }],
    }).sort({ createdAt: -1 }),
  ]);

  return res.status(200).json({
    success: true,
    data: { user, customCategories, projects },
    message: 'User detail fetched',
  });
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, data: null, message: 'User not found' });
  }
  if (user.role === 'admin') {
    return res.status(403).json({ success: false, data: null, message: 'Cannot delete an admin account' });
  }
  // Cascade-delete all user data
  await Promise.all([
    UserCategory.deleteMany({ userId: req.params.id }),
    Link.deleteMany({ userId: req.params.id }),
    Notification.deleteMany({ userId: req.params.id }),
    Project.deleteMany({ ownerId: req.params.id }),
    Project.updateMany(
      { 'members.userId': req.params.id },
      { $pull: { members: { userId: req.params.id } } }
    ),
    User.findByIdAndDelete(req.params.id),
  ]);
  return res.status(200).json({ success: true, data: null, message: 'User deleted successfully' });
};

// ── Global Category CRUD ──────────────────────────────────────────────────────

// GET /api/admin/categories
export const listGlobalCategories = async (req, res) => {
  const { search = '' } = req.query;
  const filter = search.trim()
    ? { name: { $regex: search.trim(), $options: 'i' } }
    : {};

  const categories = await GlobalCategory.find(filter).sort({ name: 1 });

  return res.status(200).json({
    success: true,
    data: { categories },
    message: 'Global categories fetched',
  });
};

// POST /api/admin/categories
export const createGlobalCategory = async (req, res) => {
  const { name, description, icon, color, allowedExtensions } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Category name must be at least 2 characters',
    });
  }

  const category = await GlobalCategory.create({
    name: name.trim(),
    description: description?.trim() || '',
    icon: icon || 'Folder',
    color: color || '#6c5dd3',
    allowedExtensions: Array.isArray(allowedExtensions) ? allowedExtensions : [],
  });

  return res.status(201).json({
    success: true,
    data: { category },
    message: 'Global category created',
  });
};

// PATCH /api/admin/categories/:id
export const updateGlobalCategory = async (req, res) => {
  const { name, description, icon, color, isActive, allowedExtensions } = req.body;

  const category = await GlobalCategory.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, data: null, message: 'Category not found' });
  }

  if (name !== undefined) category.name = name.trim();
  if (description !== undefined) category.description = description.trim();
  if (icon !== undefined) category.icon = icon;
  if (color !== undefined) category.color = color;
  if (isActive !== undefined) category.isActive = isActive;
  if (allowedExtensions !== undefined) category.allowedExtensions = Array.isArray(allowedExtensions) ? allowedExtensions : [];

  await category.save();

  return res.status(200).json({
    success: true,
    data: { category },
    message: 'Global category updated',
  });
};

// DELETE /api/admin/categories/:id
export const deleteGlobalCategory = async (req, res) => {
  const category = await GlobalCategory.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, data: null, message: 'Category not found' });
  }

  await category.deleteOne();

  return res.status(200).json({
    success: true,
    data: null,
    message: 'Global category deleted',
  });
};
