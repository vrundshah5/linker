import { Router } from 'express';
import { getPublicFavorites } from '../controllers/publicController.js';

const router = Router();

// No auth — public routes
router.get('/:userId/favorites', getPublicFavorites);

export default router;
