import { Router } from 'express';
import { getPublicFavorites, checkProfessionalEmail } from '../controllers/publicController.js';

const router = Router();

// No auth — public routes
router.get('/check-professional', checkProfessionalEmail);
router.get('/:userId/favorites', getPublicFavorites);

export default router;
