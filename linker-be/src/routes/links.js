import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  getArchivedLinks,
  createExtensionLink,
} from '../controllers/linkController.js';

const router = Router();

router.use(auth);

router.get('/archived', getArchivedLinks);
router.post('/extension', createExtensionLink);
router.get('/', getLinks);
router.post('/', createLink);
router.patch('/:id', updateLink);
router.delete('/:id', deleteLink);

export default router;
