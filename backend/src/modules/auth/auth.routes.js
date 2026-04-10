import { Router } from 'express';
import { login } from './auth.controller.js';
import { forgotPasswordController } from './auth.forgot-password.controller.js';
import { resetPasswordController } from './auth.reset-password.controller.js';

const router = Router();
router.post('/login', login);
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password', resetPasswordController);
export default router;
