import { Router } from 'express';
import { login } from './auth.controller.js';
import { forgotPasswordController } from './auth.forgot-password.controller.js';
import { resetPasswordController } from './auth.reset-password.controller.js';
import { verifyEmailController, resendVerificationController } from './auth.verify-email.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

// Public auth routes
router.post('/login', login);
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password', resetPasswordController);
router.get('/verify-email', verifyEmailController);

// Protected — requires valid JWT
router.post('/resend-verification', authenticate, resendVerificationController);

export default router;
