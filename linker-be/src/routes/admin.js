import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import {
  listUsers,
  toggleBan,
  getUserDetail,
  listGlobalCategories,
  createGlobalCategory,
  updateGlobalCategory,
  deleteGlobalCategory,
} from '../controllers/adminController.js';

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

// Users
router.get('/users', listUsers);
router.get('/users/:id', getUserDetail);
router.patch('/users/:id/ban', toggleBan);

// Global categories
router.get('/categories', listGlobalCategories);
router.post('/categories', createGlobalCategory);
router.patch('/categories/:id', updateGlobalCategory);
router.delete('/categories/:id', deleteGlobalCategory);

export default router;
