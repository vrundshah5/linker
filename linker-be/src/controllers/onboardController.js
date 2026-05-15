import User from '../models/User.js';

// PATCH /api/onboard/workspace-type
// Called when user selects Personal or Professional on the /onboard screen
export const selectWorkspaceType = async (req, res) => {
  const { workspaceType } = req.body;

  if (!workspaceType || !['personal', 'professional'].includes(workspaceType)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'workspaceType must be "personal" or "professional"',
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { workspaceType },
    { new: true, select: '-password -resetPasswordToken -resetPasswordExpires' }
  );

  if (!user) {
    return res.status(404).json({ success: false, data: null, message: 'User not found' });
  }

  return res.status(200).json({
    success: true,
    data: { user },
    message: 'Workspace type saved',
  });
};

// PATCH /api/onboard/personal
// Completes personal onboarding — saves selected categories + marks onboardingComplete
export const completePersonalOnboard = async (req, res) => {
  const { categories } = req.body;

  if (!Array.isArray(categories) || categories.length === 0) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'At least one category is required',
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      onboardingComplete: true,
      workspaceType: 'personal',
      'onboardingData.categories': categories,
    },
    { new: true, select: '-password -resetPasswordToken -resetPasswordExpires' }
  );

  if (!user) {
    return res.status(404).json({ success: false, data: null, message: 'User not found' });
  }

  return res.status(200).json({
    success: true,
    data: { user },
    message: 'Personal onboarding complete!',
  });
};

// PATCH /api/onboard/professional
// Completes professional onboarding — saves project details + marks onboardingComplete
export const completeProfessionalOnboard = async (req, res) => {
  const { projectName, projectDescription, invitedEmails, resources } = req.body;

  if (!projectName || projectName.trim().length < 2) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Project name must be at least 2 characters',
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      onboardingComplete: true,
      workspaceType: 'professional',
      'onboardingData.projectName': projectName.trim(),
      'onboardingData.projectDescription': projectDescription?.trim() || null,
      'onboardingData.invitedEmails': Array.isArray(invitedEmails) ? invitedEmails : [],
      'onboardingData.resources': Array.isArray(resources) ? resources : [],
    },
    { new: true, select: '-password -resetPasswordToken -resetPasswordExpires' }
  );

  if (!user) {
    return res.status(404).json({ success: false, data: null, message: 'User not found' });
  }

  return res.status(200).json({
    success: true,
    data: { user },
    message: 'Professional onboarding complete!',
  });
};
