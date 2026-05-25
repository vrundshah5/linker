import Link from '../models/Link.js';
import User from '../models/User.js';

// GET /api/public/check-professional?email=...
// Check if a user exists and has a professional workspace
export const checkProfessionalEmail = async (req, res) => {
  try {
    const email = (req.query.email || '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ success: false, data: null, message: 'Email is required' });
    }
    const user = await User.findOne({ email }).select('workspaceType onboardingComplete');
    if (!user) {
      return res.status(404).json({ success: false, data: null, message: 'No account found with this email' });
    }
    if (user.workspaceType !== 'professional') {
      return res.status(422).json({ success: false, data: null, message: 'This user does not have a Professional workspace' });
    }
    return res.json({ success: true, data: null, message: 'Professional user found' });
  } catch (err) {
    console.error('checkProfessionalEmail error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

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
