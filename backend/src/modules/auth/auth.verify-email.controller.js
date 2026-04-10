import { verifyEmailToken, sendVerificationEmail } from './auth.verify-email.service.js';
import prisma from '../../lib/prisma.js';

/**
 * GET /api/auth/verify-email?token=xxx
 * Verifies the token from the email link.
 */
export async function verifyEmailController(req, res) {
  try {
    const { token } = req.query;
    await verifyEmailToken(token);
    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    if (error.message === 'MISSING_TOKEN') {
      return res.status(400).json({ message: 'Verification token is missing' });
    }
    if (error.message === 'INVALID_TOKEN') {
      return res.status(400).json({ message: 'Invalid verification token' });
    }
    if (error.message === 'TOKEN_EXPIRED') {
      return res.status(400).json({ message: 'Verification link has expired. Please request a new one.' });
    }
    if (error.message === 'ALREADY_VERIFIED') {
      return res.status(200).json({ message: 'Email is already verified' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

/**
 * POST /api/auth/resend-verification
 * Resends the verification email for the authenticated user.
 */
export async function resendVerificationController(req, res) {
  try {
    const userId = parseInt(req.user.userId);

    const user = await prisma.usertable.findUnique({
      where: { UserID: userId },
    });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.EmailVerified) return res.status(400).json({ message: 'Email is already verified' });

    await sendVerificationEmail(userId, user.Email);
    return res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}
