import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { getRequests, sendRequest, respondRequest, cancelRequest } from '../controllers/requestController.js';

const router = Router();

router.use(requireAuth);

router.get('/', getRequests);
router.post('/', sendRequest);
router.patch('/:id', respondRequest);
router.delete('/:id', cancelRequest);

export default router;
