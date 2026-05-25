import { Router } from 'express';
import { signup, login, forgotPassword, resetPassword, googleAuth, sendOtp } from '../controllers/authController.js';

const router = Router();

router.post('/send-otp', sendOtp);
router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
