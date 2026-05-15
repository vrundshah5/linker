import Link from '../models/Link.js';
import UserCategory from '../models/UserCategory.js';

// GET /api/links?categoryId=xxx
export const getLinks = async (req, res) => {
  try {
    const { categoryId } = req.query;
    if (!categoryId) {
      return res.status(400).json({ success: false, data: null, message: 'categoryId is required' });
    }

    // Verify the category belongs to this user
    const category = await UserCategory.findOne({ _id: categoryId, userId: req.user.id });
    if (!category) {
      return res.status(404).json({ success: false, data: null, message: 'Category not found' });
    }

    const links = await Link.find({ userId: req.user.id, categoryId })
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: { links }, message: 'Links fetched' });
  } catch (err) {
    console.error('getLinks error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// POST /api/links
export const createLink = async (req, res) => {
  try {
    const { categoryId, title, url, description } = req.body;

    if (!categoryId || !title || !url) {
      return res.status(400).json({ success: false, data: null, message: 'categoryId, title, and url are required' });
    }

    // Basic URL format check
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ success: false, data: null, message: 'Invalid URL format' });
    }

    // Verify category ownership
    const category = await UserCategory.findOne({ _id: categoryId, userId: req.user.id });
    if (!category) {
      return res.status(404).json({ success: false, data: null, message: 'Category not found' });
    }

    const link = await Link.create({
      userId: req.user.id,
      categoryId,
      title: title.trim(),
      url: url.trim(),
      description: description?.trim() ?? '',
    });

    // Increment link count on the category
    await UserCategory.findByIdAndUpdate(categoryId, { $inc: { linkCount: 1 } });

    return res.status(201).json({ success: true, data: { link }, message: 'Link created' });
  } catch (err) {
    console.error('createLink error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// PATCH /api/links/:id
export const updateLink = async (req, res) => {
  try {
    const { title, url, description, isFavorite, isArchived } = req.body;

    const link = await Link.findOne({ _id: req.params.id, userId: req.user.id });
    if (!link) {
      return res.status(404).json({ success: false, data: null, message: 'Link not found' });
    }

    if (url !== undefined) {
      try {
        new URL(url);
      } catch {
        return res.status(400).json({ success: false, data: null, message: 'Invalid URL format' });
      }
      link.url = url.trim();
    }
    if (title !== undefined) link.title = title.trim();
    if (description !== undefined) link.description = description.trim();
    if (isFavorite !== undefined) link.isFavorite = Boolean(isFavorite);
    if (isArchived !== undefined) link.isArchived = Boolean(isArchived);

    await link.save();

    return res.json({ success: true, data: { link }, message: 'Link updated' });
  } catch (err) {
    console.error('updateLink error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// GET /api/links/archived — all archived links for the user (cross-category)
export const getArchivedLinks = async (req, res) => {
  try {
    const links = await Link.find({ userId: req.user.id, isArchived: true })
      .populate('categoryId', 'name themeColor icon')
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: { links }, message: 'Archived links fetched' });
  } catch (err) {
    console.error('getArchivedLinks error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// POST /api/links/extension — save a link from the browser extension (auto-category, isArchived: true)
export const createExtensionLink = async (req, res) => {
  try {
    const { url, title } = req.body;

    if (!url || !title) {
      return res.status(400).json({ success: false, data: null, message: 'url and title are required' });
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).json({ success: false, data: null, message: 'Invalid URL format' });
    }

    const category = await UserCategory.findOne({ userId: req.user.id }).sort({ createdAt: 1 });
    if (!category) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'No categories found. Please create a category in Linker first.',
      });
    }

    const link = await Link.create({
      userId: req.user.id,
      categoryId: category._id,
      title: title.trim().slice(0, 200),
      url: url.trim(),
      description: 'Saved by Linker Extension',
      isArchived: true,
    });

    await UserCategory.findByIdAndUpdate(category._id, { $inc: { linkCount: 1 } });

    return res.status(201).json({ success: true, data: { link }, message: 'Link saved to archive' });
  } catch (err) {
    console.error('createExtensionLink error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// DELETE /api/links/:id
export const deleteLink = async (req, res) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, userId: req.user.id });
    if (!link) {
      return res.status(404).json({ success: false, data: null, message: 'Link not found' });
    }

    await link.deleteOne();

    // Decrement link count (floor at 0)
    await UserCategory.findByIdAndUpdate(link.categoryId, {
      $inc: { linkCount: -1 },
    });

    return res.json({ success: true, data: null, message: 'Link deleted' });
  } catch (err) {
    console.error('deleteLink error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};
