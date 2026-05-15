import { Router } from 'express';
import auth from '../middleware/auth.js';
import { getLinks, createLink, updateLink, deleteLink } from '../controllers/linkController.js';

const router = Router();

router.use(auth);

router.get('/', getLinks);
router.post('/', createLink);
router.patch('/:id', updateLink);
router.delete('/:id', deleteLink);

export default router;
