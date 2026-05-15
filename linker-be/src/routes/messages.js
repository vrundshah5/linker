import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import {
  getConversations,
  getMessages,
  sendMessage,
  markRead,
} from '../controllers/messageController.js';

const router = Router();

router.use(requireAuth);

router.get('/conversations', getConversations);
router.get('/:userId', getMessages);
router.post('/:userId', sendMessage);
router.patch('/:userId/read', markRead);

export default router;
