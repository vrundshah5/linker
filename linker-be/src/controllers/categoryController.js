import GlobalCategory from '../models/GlobalCategory.js';
import UserCategory from '../models/UserCategory.js';

// GET /api/categories/global
// Returns all active global categories (used during onboarding)
export const listGlobalCategories = async (_req, res) => {
  try {
    const categories = await GlobalCategory.find({ isActive: true }).sort({ name: 1 });
    return res.status(200).json({
      success: true,
      data: { categories },
      message: 'Global categories fetched',
    });
  } catch (err) {
    console.error('listGlobalCategories error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// GET /api/categories
// Returns the authenticated user's categories (global-selected + custom)
export const getMyCategories = async (req, res) => {
  try {
    const query = { userId: req.user.id }
    if (req.query.context) query.context = req.query.context
    const categories = await UserCategory.find(query).sort({ createdAt: 1 });
    return res.status(200).json({
      success: true,
      data: { categories },
      message: 'Categories fetched',
    });
  } catch (err) {
    console.error('getMyCategories error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// POST /api/categories
// Creates a custom user category
export const createUserCategory = async (req, res) => {
  try {
    const { name, description, themeColor, icon, context } = req.body;

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
      context: ['personal', 'professional'].includes(context) ? context : 'personal',
    });

    return res.status(201).json({
      success: true,
      data: { category },
      message: 'Category created',
    });
  } catch (err) {
    console.error('createUserCategory error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// PATCH /api/categories/:id
// Updates a user's own category (name, description, themeColor)
export const updateUserCategory = async (req, res) => {
  try {
    const { name, description, themeColor } = req.body;

    if (name !== undefined && name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Category name must be at least 2 characters',
      });
    }

    const category = await UserCategory.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!category) {
      return res.status(404).json({ success: false, data: null, message: 'Category not found' });
    }

    if (name !== undefined) category.name = name.trim();
    if (description !== undefined) category.description = description.trim();
    if (themeColor !== undefined) category.themeColor = themeColor;

    await category.save();

    return res.status(200).json({
      success: true,
      data: { category },
      message: 'Category updated',
    });
  } catch (err) {
    console.error('updateUserCategory error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// DELETE /api/categories/:id
// Deletes a user's custom category
export const deleteUserCategory = async (req, res) => {
  try {
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
  } catch (err) {
    console.error('deleteUserCategory error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};
