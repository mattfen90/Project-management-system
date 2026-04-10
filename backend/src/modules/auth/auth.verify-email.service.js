import crypto from 'crypto';
import prisma from '../../lib/prisma.js';
import { sendEmail } from '../../lib/mailer.js';

/**
 * Generate a verification token, store it, and send the verification email.
 */
export async function sendVerificationEmail(userId, email) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.usertable.update({
    where: { UserID: userId },
    data: {
      EmailVerificationToken: token,
      EmailVerificationExpires: expiresAt,
    },
  });

  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await sendEmail({
    to: email,
    subject: 'Verify your email address',
    html: `
      <p>Hello,</p>
      <p>Please verify your email address by clicking the link below. This link expires in 24 hours.</p>
      <p><a href="${verifyUrl}" style="color:#007bff">Verify Email Address</a></p>
      <p>If you did not create an account, you can safely ignore this email.</p>
    `,
  });
}

/**
 * Verify the token and mark the user's email as verified.
 */
export async function verifyEmailToken(token) {
  if (!token) throw new Error('MISSING_TOKEN');

  const user = await prisma.usertable.findFirst({
    where: {
      EmailVerificationToken: token,
      deleted_at: null,
    },
  });

  if (!user) throw new Error('INVALID_TOKEN');

  if (new Date(user.EmailVerificationExpires) < new Date()) {
    throw new Error('TOKEN_EXPIRED');
  }

  if (user.EmailVerified) throw new Error('ALREADY_VERIFIED');

  await prisma.usertable.update({
    where: { UserID: user.UserID },
    data: {
      EmailVerified: true,
      EmailVerificationToken: null,
      EmailVerificationExpires: null,
    },
  });
}
