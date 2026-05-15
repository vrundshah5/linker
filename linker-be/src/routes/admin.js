import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { listUsers, toggleBan } from '../controllers/adminController.js';

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get('/users', listUsers);
router.patch('/users/:id/ban', toggleBan);

export default router;
