import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import {
  listGlobalCategories,
  getMyCategories,
  createUserCategory,
  updateUserCategory,
  deleteUserCategory,
} from '../controllers/categoryController.js';

const router = Router();

router.use(requireAuth);

// Global categories for onboarding picker
router.get('/global', listGlobalCategories);

// User's own categories
router.get('/', getMyCategories);
router.post('/', createUserCategory);
router.patch('/:id', updateUserCategory);
router.delete('/:id', deleteUserCategory);

export default router;
