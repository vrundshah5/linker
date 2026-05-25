import User from '../models/User.js';
import GlobalCategory from '../models/GlobalCategory.js';
import UserCategory from '../models/UserCategory.js';
import Project from '../models/Project.js';
import ProjectResource from '../models/ProjectResource.js';

// PATCH /api/onboard/workspace-type
// Called when user selects Personal or Professional on the /onboard screen
export const selectWorkspaceType = async (req, res) => {
  try {
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
  } catch (err) {
    console.error('selectWorkspaceType error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// PATCH /api/onboard/personal
// Completes personal onboarding — saves selected global category IDs,
// creates UserCategory documents, and marks onboardingComplete
export const completePersonalOnboard = async (req, res) => {
  try {
    const { categories } = req.body;

    if (!Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'categories must be an array',
      });
    }

    // Only process if user selected at least one category
    if (categories.length > 0) {
      // Validate that all IDs are real active global categories
      const globalCats = await GlobalCategory.find({
        _id: { $in: categories },
        isActive: true,
      });

      if (globalCats.length > 0) {
        // Upsert UserCategory records for each selected global category
        const upsertOps = globalCats.map((gc) => ({
          updateOne: {
            filter: { userId: req.user.id, globalCategoryId: gc._id },
            update: {
              $setOnInsert: {
                userId: req.user.id,
                name: gc.name,
                description: gc.description,
                themeColor: gc.color,
                icon: gc.icon,
                isGlobal: true,
                globalCategoryId: gc._id,
                linkCount: 0,
              },
            },
            upsert: true,
          },
        }));

        await UserCategory.bulkWrite(upsertOps);
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        onboardingComplete: true,
        workspaceType: 'personal',
        'onboardingData.categories': categories,
        $addToSet: { workspaces: 'personal' },
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
  } catch (err) {
    console.error('completePersonalOnboard error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// PATCH /api/onboard/professional
// Completes professional onboarding — saves project details + marks onboardingComplete
export const completeProfessionalOnboard = async (req, res) => {
  try {
    const { projectName, projectDescription, invitedEmails, resources } = req.body;

    // If projectName is provided, validate it
    if (projectName && projectName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Project name must be at least 2 characters',
      });
    }

    const updateFields = {
      onboardingComplete: true,
      workspaceType: 'professional',
      $addToSet: { workspaces: 'professional' },
    };

    // Only store onboarding project data if a project is being created
    if (projectName && projectName.trim()) {
      updateFields['onboardingData.projectName'] = projectName.trim();
      updateFields['onboardingData.projectDescription'] = projectDescription?.trim() || null;
      updateFields['onboardingData.invitedEmails'] = Array.isArray(invitedEmails) ? invitedEmails : [];
      updateFields['onboardingData.resources'] = Array.isArray(resources) ? resources : [];
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, select: '-password -resetPasswordToken -resetPasswordExpires' }
    );

    if (!user) {
      return res.status(404).json({ success: false, data: null, message: 'User not found' });
    }

    // Create the first project only if projectName was provided
    if (projectName && projectName.trim()) {
      const project = await Project.create({
        name: projectName.trim(),
        description: projectDescription?.trim() || '',
        ownerId: user._id,
        members: [{ userId: user._id, role: 'admin' }],
      });

      // Save onboarding resources to the project
      const resourceUrls = Array.isArray(resources) ? resources.filter((r) => r && r.trim()) : [];
      if (resourceUrls.length > 0) {
        const resourceDocs = resourceUrls.map((url) => ({
          projectId: project._id,
          addedBy: user._id,
          title: '',
          url: url.trim(),
        }));
        await ProjectResource.insertMany(resourceDocs);
      }

      // Save invited emails as pending invites on the project
      const emailsToInvite = Array.isArray(invitedEmails) ? invitedEmails.filter(Boolean) : [];
      if (emailsToInvite.length > 0) {
        const invitedUsers = await User.find({
          email: { $in: emailsToInvite.map((e) => e.toLowerCase()) },
          workspaceType: 'professional',
        }).select('_id');

        for (const invitedUser of invitedUsers) {
          const alreadyInvited = project.invites.some(
            (inv) => inv.userId.toString() === invitedUser._id.toString()
          );
          if (!alreadyInvited) {
            project.invites.push({ userId: invitedUser._id, invitedBy: user._id, status: 'pending' });
          }
        }
        if (invitedUsers.length > 0) await project.save();
      }
    }

    return res.status(200).json({
      success: true,
      data: { user },
      message: 'Professional onboarding complete!',
    });
  } catch (err) {
    console.error('completeProfessionalOnboard error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};
