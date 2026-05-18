import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const SAFE_SELECT = '-password -resetPasswordToken -resetPasswordExpires';
const SALT_ROUNDS = 12;

// GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(SAFE_SELECT);
    if (!user) return res.status(404).json({ success: false, data: null, message: 'User not found' });

    return res.json({ success: true, data: { user }, message: 'Profile fetched' });
  } catch (err) {
    console.error('getProfile error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// PATCH /api/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, avatar, phone, location, jobTitle, company, website, bio } = req.body;

    const update = {};

    if (name !== undefined) {
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, data: null, message: 'Name cannot be empty' });
      }
      update.name = name.trim();
    }
    if (avatar    !== undefined) update.avatar    = avatar.trim();
    if (phone     !== undefined) update.phone     = phone.trim();
    if (location  !== undefined) update.location  = location.trim();
    if (jobTitle  !== undefined) update.jobTitle  = jobTitle.trim();
    if (company   !== undefined) update.company   = company.trim();
    if (bio       !== undefined) update.bio       = bio.trim();

    if (website !== undefined) {
      if (website.trim() && !/^https?:\/\/.+/.test(website.trim())) {
        return res.status(400).json({ success: false, data: null, message: 'Website must start with http:// or https://' });
      }
      update.website = website.trim();
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: update },
      { new: true, select: SAFE_SELECT }
    );

    if (!user) return res.status(404).json({ success: false, data: null, message: 'User not found' });

    return res.json({ success: true, data: { user }, message: 'Profile updated' });
  } catch (err) {
    console.error('updateProfile error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// PATCH /api/profile/workspace
// Switch between personal and professional workspace.
export const switchWorkspace = async (req, res) => {
  try {
    const { workspaceType } = req.body;

    if (!workspaceType || !['personal', 'professional'].includes(workspaceType)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'workspaceType must be "personal" or "professional"',
      });
    }

    // Verify the user has the target workspace set up
    const currentUser = await User.findById(req.user.id).select('workspaces');
    if (!currentUser) return res.status(404).json({ success: false, data: null, message: 'User not found' });

    if (!currentUser.workspaces.includes(workspaceType)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: `You don't have a ${workspaceType} workspace set up`,
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { workspaceType } },
      { new: true, select: SAFE_SELECT }
    );

    return res.json({ success: true, data: { user }, message: 'Workspace switched' });
  } catch (err) {
    console.error('switchWorkspace error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// PATCH /api/profile/password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, data: null, message: 'All fields are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, data: null, message: 'New password must be at least 8 characters' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, data: null, message: 'New password and confirmation do not match' });
    }

    const user = await User.findById(req.user.id).select('password');
    if (!user) return res.status(404).json({ success: false, data: null, message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, data: null, message: 'Current password is incorrect' });
    }

    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await User.findByIdAndUpdate(req.user.id, { $set: { password: hashed } });

    return res.json({ success: true, data: null, message: 'Password changed successfully' });
  } catch (err) {
    console.error('changePassword error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};
