import GlobalCategory from '../models/GlobalCategory.js';
import UserCategory from '../models/UserCategory.js';

// GET /api/global-categories
// Returns all active global categories (used during onboarding)
export const listGlobalCategories = async (_req, res) => {
  const categories = await GlobalCategory.find({ isActive: true }).sort({ name: 1 });
  return res.status(200).json({
    success: true,
    data: { categories },
    message: 'Global categories fetched',
  });
};

// GET /api/categories
// Returns the authenticated user's categories (global-selected + custom)
export const getMyCategories = async (req, res) => {
  const categories = await UserCategory.find({ userId: req.user.id }).sort({ createdAt: 1 });
  return res.status(200).json({
    success: true,
    data: { categories },
    message: 'Categories fetched',
  });
};

// POST /api/categories
// Creates a custom user category
export const createUserCategory = async (req, res) => {
  const { name, description, themeColor, icon } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Category name must be at least 2 characters',
    });
  }

  const category = await UserCategory.create({
    userId: req.user.id,
    name: name.trim(),
    description: description?.trim() || '',
    themeColor: themeColor || '#6c5dd3',
    icon: icon || 'Folder',
    isGlobal: false,
    globalCategoryId: null,
  });

  return res.status(201).json({
    success: true,
    data: { category },
    message: 'Category created',
  });
};

// DELETE /api/categories/:id
// Deletes a user's custom category
export const deleteUserCategory = async (req, res) => {
  const category = await UserCategory.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!category) {
    return res.status(404).json({ success: false, data: null, message: 'Category not found' });
  }

  await category.deleteOne();

  return res.status(200).json({
    success: true,
    data: null,
    message: 'Category deleted',
  });
};
