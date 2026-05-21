import Project from '../models/Project.js';
import Link from '../models/Link.js';
import ProjectResource from '../models/ProjectResource.js';
import { createNotification } from './notificationController.js';
import ProjectMessage from '../models/ProjectMessage.js';
import User from '../models/User.js';

// GET /api/projects — all projects the user owns or is a member of
export const listProjects = async (req, res) => {
  try {
    const myId = req.user.id;

    const projects = await Project.find({
      $or: [{ ownerId: myId }, { 'members.userId': myId }],
    })
      .populate('ownerId', 'name email')
      .populate('members.userId', 'name email')
      .sort({ updatedAt: -1 });

    // Attach resource count to each project
    const projectIds = projects.map((p) => p._id);
    const resourceCounts = await ProjectResource.aggregate([
      { $match: { projectId: { $in: projectIds } } },
      { $group: { _id: '$projectId', count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(resourceCounts.map((r) => [r._id.toString(), r.count]));

    const data = projects.map((p) => ({
      ...p.toObject(),
      resourceCount: countMap[p._id.toString()] ?? 0,
    }));

    return res.json({ success: true, data, message: 'Projects fetched' });
  } catch (err) {
    console.error('listProjects error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// POST /api/projects
export const createProject = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, data: null, message: 'Project name is required' });
    }

    const project = await Project.create({
      name: name.trim(),
      description: description?.trim() || '',
      ownerId: req.user.id,
      color: color || '#f59e0b',
      members: [{ userId: req.user.id, role: 'admin' }],
    });

    await project.populate('ownerId', 'name email');
    await project.populate('members.userId', 'name email');

    return res.status(201).json({ success: true, data: project, message: 'Project created' });
  } catch (err) {
    console.error('createProject error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// PATCH /api/projects/:id
export const updateProject = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const project = await Project.findOne({
      _id: req.params.id,
      $or: [{ ownerId: req.user.id }, { members: { $elemMatch: { userId: req.user.id, role: 'admin' } } }],
    });

    if (!project) {
      return res.status(404).json({ success: false, data: null, message: 'Project not found or no permission' });
    }

    if (name !== undefined) project.name = name.trim();
    if (description !== undefined) project.description = description.trim();
    if (color !== undefined) project.color = color;

    await project.save();
    await project.populate('ownerId', 'name email');
    await project.populate('members.userId', 'name email');

    return res.json({ success: true, data: project, message: 'Project updated' });
  } catch (err) {
    console.error('updateProject error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, ownerId: req.user.id });
    if (!project) {
      return res.status(404).json({ success: false, data: null, message: 'Project not found or not the owner' });
    }

    await project.deleteOne();
    return res.json({ success: true, data: null, message: 'Project deleted' });
  } catch (err) {
    console.error('deleteProject error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// GET /api/projects/:id/stats — link count for a project (placeholder for more stats)
export const getProjectStats = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [{ ownerId: req.user.id }, { 'members.userId': req.user.id }],
    });

    if (!project) {
      return res.status(404).json({ success: false, data: null, message: 'Project not found' });
    }

    const memberIds = project.members.map((m) => m.userId);
    const linkCount = await Link.countDocuments({ userId: { $in: memberIds } });

    return res.json({
      success: true,
      data: { linkCount, memberCount: project.members.length },
      message: 'Stats fetched',
    });
  } catch (err) {
    console.error('getProjectStats error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// POST /api/projects/:id/members — invite a professional user by email
export const addProjectMember = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, data: null, message: 'Email is required' });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      $or: [{ ownerId: req.user.id }, { members: { $elemMatch: { userId: req.user.id, role: 'admin' } } }],
    });

    if (!project) {
      return res.status(404).json({ success: false, data: null, message: 'Project not found or no permission' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('_id name email workspaces workspaceType');

    if (!user) {
      return res.status(404).json({ success: false, data: null, message: 'No user found with this email address' });
    }

    if (!user.workspaces.includes('professional') && user.workspaceType !== 'professional') {
      return res.status(400).json({ success: false, data: null, message: 'This user does not have a professional workspace' });
    }

    const alreadyMember = project.members.some((m) => m.userId.toString() === user._id.toString());
    if (alreadyMember) {
      return res.status(400).json({ success: false, data: null, message: 'This user is already a member of the project' });
    }

    project.members.push({ userId: user._id, role: 'member' });
    await project.save();
    await project.populate('ownerId', 'name email');
    await project.populate('members.userId', 'name email');

    // Notify the added user
    await createNotification({
      userId: user._id,
      type: 'project_invite',
      title: 'Added to a project',
      body: `${req.user.name ?? 'Someone'} added you to the project "${project.name}".`,
      meta: { projectId: project._id, fromUserId: req.user.id, actorName: req.user.name ?? null, projectName: project.name },
      context: 'professional',
    });

    return res.json({ success: true, data: project, message: 'Member added' });
  } catch (err) {
    console.error('addProjectMember error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// DELETE /api/projects/:id/members/:userId — remove member from project
export const removeProjectMember = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [{ ownerId: req.user.id }, { members: { $elemMatch: { userId: req.user.id, role: 'admin' } } }],
    });

    if (!project) {
      return res.status(404).json({ success: false, data: null, message: 'Project not found or no permission' });
    }

    const memberIndex = project.members.findIndex((m) => m.userId.toString() === req.params.userId);
    if (memberIndex === -1) {
      return res.status(404).json({ success: false, data: null, message: 'Member not found in project' });
    }

    // Cannot remove yourself if you're the owner
    if (req.params.userId === req.user.id && project.ownerId.toString() === req.user.id) {
      return res.status(400).json({ success: false, data: null, message: 'Project owner cannot be removed' });
    }

    project.members.splice(memberIndex, 1);
    await project.save();
    await project.populate('ownerId', 'name email');
    await project.populate('members.userId', 'name email');

    return res.json({ success: true, data: project, message: 'Member removed' });
  } catch (err) {
    console.error('removeProjectMember error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// GET /api/projects/:id/resources — list project resources
export const listProjectResources = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [{ ownerId: req.user.id }, { 'members.userId': req.user.id }],
    });

    if (!project) {
      return res.status(404).json({ success: false, data: null, message: 'Project not found' });
    }

    const resources = await ProjectResource.find({ projectId: req.params.id })
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: resources, message: 'Resources fetched' });
  } catch (err) {
    console.error('listProjectResources error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// POST /api/projects/:id/resources — add resources to project
export const addProjectResources = async (req, res) => {
  try {
    const { resources } = req.body;

    if (!Array.isArray(resources) || resources.length === 0) {
      return res.status(400).json({ success: false, data: null, message: 'Resources array is required' });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      $or: [{ ownerId: req.user.id }, { 'members.userId': req.user.id }],
    });

    if (!project) {
      return res.status(404).json({ success: false, data: null, message: 'Project not found or no permission' });
    }

    const docs = resources
      .filter((r) => r.url && r.url.trim())
      .map((r) => ({
        projectId: req.params.id,
        addedBy: req.user.id,
        title: r.title?.trim() || '',
        url: r.url.trim(),
      }));

    const created = await ProjectResource.insertMany(docs);

    return res.status(201).json({ success: true, data: created, message: 'Resources added' });
  } catch (err) {
    console.error('addProjectResources error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// DELETE /api/projects/:id/resources/:resourceId — delete a resource
export const deleteProjectResource = async (req, res) => {
  try {
    const resource = await ProjectResource.findOne({
      _id: req.params.resourceId,
      projectId: req.params.id,
    });

    if (!resource) {
      return res.status(404).json({ success: false, data: null, message: 'Resource not found' });
    }

    await resource.deleteOne();
    return res.json({ success: true, data: null, message: 'Resource deleted' });
  } catch (err) {
    console.error('deleteProjectResource error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// PATCH /api/projects/:id/resources/:resourceId — update a resource
export const updateProjectResource = async (req, res) => {
  try {
    const { title, url } = req.body;
    const resource = await ProjectResource.findOne({
      _id: req.params.resourceId,
      projectId: req.params.id,
    });

    if (!resource) {
      return res.status(404).json({ success: false, data: null, message: 'Resource not found' });
    }

    if (title !== undefined) resource.title = title.trim();
    if (url !== undefined) resource.url = url.trim();
    await resource.save();

    return res.json({ success: true, data: resource, message: 'Resource updated' });
  } catch (err) {
    console.error('updateProjectResource error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// GET /api/projects/:id/messages — list project chat messages
export const listProjectMessages = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [{ ownerId: req.user.id }, { 'members.userId': req.user.id }],
    });

    if (!project) {
      return res.status(404).json({ success: false, data: null, message: 'Project not found' });
    }

    const messages = await ProjectMessage.find({ projectId: req.params.id })
      .populate('senderId', 'name email')
      .sort({ createdAt: 1 });

    return res.json({ success: true, data: messages, message: 'Messages fetched' });
  } catch (err) {
    console.error('listProjectMessages error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};

// POST /api/projects/:id/messages — send a message in project chat
export const sendProjectMessage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, data: null, message: 'Message text is required' });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      $or: [{ ownerId: req.user.id }, { 'members.userId': req.user.id }],
    });

    if (!project) {
      return res.status(404).json({ success: false, data: null, message: 'Project not found or no permission' });
    }

    const message = await ProjectMessage.create({
      projectId: req.params.id,
      senderId: req.user.id,
      text: text.trim(),
    });

    await message.populate('senderId', 'name email');

    return res.status(201).json({ success: true, data: message, message: 'Message sent' });
  } catch (err) {
    console.error('sendProjectMessage error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
};
