import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { getNotifications, markAllRead, markOneRead, deleteNotification } from '../controllers/notificationController.js';

const router = Router();

router.use(requireAuth);

router.get('/', getNotifications);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markOneRead);
router.delete('/:id', deleteNotification);

export default router;
