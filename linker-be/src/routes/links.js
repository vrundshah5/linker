import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  getLinks,
  getRecentLinks,
  getLinkStats,
  getLinkFavorites,
  createLink,
  updateLink,
  deleteLink,
  bulkDeleteLinks,
  getArchivedLinks,
  createExtensionLink,
  importBookmarks,
} from '../controllers/linkController.js';

const router = Router();

router.use(auth);

router.get('/archived', getArchivedLinks);
router.get('/favorites', getLinkFavorites);
router.get('/recent', getRecentLinks);
router.get('/stats', getLinkStats);
router.post('/extension', createExtensionLink);
router.post('/import', importBookmarks);
router.get('/', getLinks);
router.post('/', createLink);
router.patch('/:id', updateLink);
router.delete('/bulk', bulkDeleteLinks);
router.delete('/:id', deleteLink);

export default router;
