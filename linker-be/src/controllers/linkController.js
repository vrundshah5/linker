import mongoose from 'mongoose';
import Link from '../models/Link.js';
import UserCategory from '../models/UserCategory.js';

// GET /api/links/stats?days=30
export const getLinkStats = async (req, res) => {
  try {
    const numDays = Math.min(parseInt(req.query.days) || 30, 90)
    const since = new Date()
    since.setDate(since.getDate() - (numDays - 1))
    since.setHours(0, 0, 0, 0)

    const userId = new mongoose.Types.ObjectId(req.user.id)

    const [totalLinks, totalFavorites, totalArchived, daily, categoryBreakdown] = await Promise.all([
      Link.countDocuments({ userId, isArchived: { $ne: true } }),
      Link.countDocuments({ userId, isFavorite: true, isArchived: { $ne: true } }),
      Link.countDocuments({ userId, isArchived: true }),
      Link.aggregate([
        { $match: { userId, createdAt: { $gte: since }, isArchived: { $ne: true } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Link.aggregate([
        { $match: { userId, isArchived: { $ne: true } } },
        { $group: { _id: '$categoryId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'usercategories', localField: '_id', foreignField: '_id', as: 'cat' } },
        { $unwind: { path: '$cat', preserveNullAndEmptyArrays: true } },
        { $project: { _id: 1, count: 1, name: '$cat.name', icon: '$cat.icon', themeColor: '$cat.themeColor' } },
      ]),
    ])

    return res.json({
      success: true,
      data: { totalLinks, totalFavorites, totalArchived, daily, categoryBreakdown },
      message: 'Stats fetched',
    })
  } catch (err) {
    console.error('getLinkStats error:', err)
    return res.status(500).json({ success: false, data: null, message: 'Server error' })
  }
}

// GET /api/links/favorites
export const getLinkFavorites = async (req, res) => {
  try {
    const links = await Link.find({ userId: req.user.id, isFavorite: true, isArchived: { $ne: true } })
      .sort({ createdAt: -1 })
      .populate('categoryId', 'name themeColor icon')
    return res.json({ success: true, data: { links }, message: 'Favorites fetched' })
  } catch (err) {
    console.error('getLinkFavorites error:', err)
    return res.status(500).json({ success: false, data: null, message: 'Server error' })
  }
}

// GET /api/links/recent?limit=6
export const getRecentLinks = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 6, 20)
    const links = await Link.find({ userId: req.user.id, isArchived: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('categoryId', 'name themeColor icon')
    return res.json({ success: true, data: { links }, message: 'Recent links fetched' })
  } catch (err) {
    console.error('getRecentLinks error:', err)
    return res.status(500).json({ success: false, data: null, message: 'Server error' })
  }
}

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

    const links = await Link.find({ userId: req.user.id, categoryId, isArchived: { $ne: true } })
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

// DELETE /api/links/bulk  — body: { ids: string[] }
export const bulkDeleteLinks = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, data: null, message: 'ids must be a non-empty array' });
    }

    // Only delete links owned by this user
    const links = await Link.find({ _id: { $in: ids }, userId: req.user.id }).select('_id categoryId');

    if (links.length === 0) {
      return res.status(404).json({ success: false, data: null, message: 'No matching links found' });
    }

    const foundIds = links.map((l) => l._id);
    await Link.deleteMany({ _id: { $in: foundIds } });

    // Decrement link count per category
    const categoryMap = {};
    for (const l of links) {
      const cid = l.categoryId.toString();
      categoryMap[cid] = (categoryMap[cid] ?? 0) + 1;
    }
    await Promise.all(
      Object.entries(categoryMap).map(([cid, count]) =>
        UserCategory.findByIdAndUpdate(cid, { $inc: { linkCount: -count } })
      )
    );

    return res.json({ success: true, data: { deleted: foundIds.length }, message: `${foundIds.length} link(s) deleted` });
  } catch (err) {
    console.error('bulkDeleteLinks error:', err);
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
