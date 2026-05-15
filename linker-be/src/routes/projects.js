import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
  addProjectMember,
  removeProjectMember,
  listProjectResources,
  addProjectResources,
  deleteProjectResource,
  listProjectMessages,
  sendProjectMessage,
} from '../controllers/projectController.js';

const router = Router();

router.use(requireAuth);

router.get('/', listProjects);
router.post('/', createProject);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);
router.get('/:id/stats', getProjectStats);

// Members
router.post('/:id/members', addProjectMember);
router.delete('/:id/members/:userId', removeProjectMember);

// Resources
router.get('/:id/resources', listProjectResources);
router.post('/:id/resources', addProjectResources);
router.delete('/:id/resources/:resourceId', deleteProjectResource);

// Messages
router.get('/:id/messages', listProjectMessages);
router.post('/:id/messages', sendProjectMessage);

export default router;
