import User from '../models/User.js';

export const requireAdmin = async (req, res, next) => {
  // requireAuth must run before this — req.user.id is set
  const user = await User.findById(req.user.id).select('role');
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, data: null, message: 'Admin access required' });
  }
  next();
};
