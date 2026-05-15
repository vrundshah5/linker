import Link from '../models/Link.js';
import User from '../models/User.js';

// GET /api/public/:userId/favorites
// Public endpoint — no auth required
export const getPublicFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('name email');
    if (!user) {
      return res.status(404).json({ success: false, data: null, message: 'User not found' });
    }

    const links = await Link.find({ userId: req.params.userId, isFavorite: true })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: { user: { _id: user._id, name: user.name }, links },
      message: 'Public favorites fetched',
    });
  } catch (err) {
    console.error('getPublicFavorites error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};
