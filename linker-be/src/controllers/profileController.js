import User from '../models/User.js';

const SAFE_SELECT = '-password -resetPasswordToken -resetPasswordExpires';

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
    const { name, phone, location, jobTitle, company, website, bio } = req.body;

    const update = {};

    if (name !== undefined) {
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, data: null, message: 'Name cannot be empty' });
      }
      update.name = name.trim();
    }
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

    const updateFields = { workspaceType };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, select: SAFE_SELECT }
    );

    if (!user) return res.status(404).json({ success: false, data: null, message: 'User not found' });

    return res.json({ success: true, data: { user }, message: 'Workspace switched' });
  } catch (err) {
    console.error('switchWorkspace error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};
