import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import {
  getUnreadCounts,
  getMentions,
  markMentionsRead,
  getBuzzes,
  markBuzzesRead,
  sendBuzz,
  getContacts,
} from '../controllers/mentionBuzzController.js';

const router = Router();
router.use(requireAuth);

router.get('/unread',          getUnreadCounts);
router.get('/mentions',        getMentions);
router.patch('/mentions/read', markMentionsRead);
router.get('/buzzes',          getBuzzes);
router.patch('/buzzes/read',   markBuzzesRead);
router.post('/buzz',           sendBuzz);
router.get('/contacts',        getContacts);

export default router;
