import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { getProfile, updateProfile, switchWorkspace } from '../controllers/profileController.js';

const router = Router();

router.use(requireAuth);

router.get('/', getProfile);
router.patch('/', updateProfile);
router.patch('/workspace', switchWorkspace);

export default router;
