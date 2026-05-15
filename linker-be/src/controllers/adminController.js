import User from '../models/User.js';
import GlobalCategory from '../models/GlobalCategory.js';
import UserCategory from '../models/UserCategory.js';

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

  const customCategories = await UserCategory.find({
    userId: req.params.id,
    isGlobal: false,
  }).sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: { user, customCategories },
    message: 'User detail fetched',
  });
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
  const { name, description, icon, color } = req.body;

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
  });

  return res.status(201).json({
    success: true,
    data: { category },
    message: 'Global category created',
  });
};

// PATCH /api/admin/categories/:id
export const updateGlobalCategory = async (req, res) => {
  const { name, description, icon, color, isActive } = req.body;

  const category = await GlobalCategory.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, data: null, message: 'Category not found' });
  }

  if (name !== undefined) category.name = name.trim();
  if (description !== undefined) category.description = description.trim();
  if (icon !== undefined) category.icon = icon;
  if (color !== undefined) category.color = color;
  if (isActive !== undefined) category.isActive = isActive;

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
