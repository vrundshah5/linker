import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { createTicket, getMyTickets, adminGetAllTickets, adminUpdateTicket } from '../controllers/supportController.js';

const router = Router();

router.use(requireAuth);

router.post('/', createTicket);
router.get('/mine', getMyTickets);

// Admin-only
router.get('/admin', requireAdmin, adminGetAllTickets);
router.patch('/admin/:id', requireAdmin, adminUpdateTicket);

export default router;
