import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import {
  selectWorkspaceType,
  completePersonalOnboard,
  completeProfessionalOnboard,
} from '../controllers/onboardController.js';

const router = Router();

// All onboard routes require a valid JWT
router.use(requireAuth);

router.patch('/workspace-type', selectWorkspaceType);
router.patch('/personal', completePersonalOnboard);
router.patch('/professional', completeProfessionalOnboard);

export default router;
