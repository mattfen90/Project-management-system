import crypto from 'crypto';
import prisma from '../../lib/prisma.js';
import { sendEmail } from '../../lib/mailer.js';

export async function forgotPassword(email) {
  if (!email) {
    throw new Error('Email is required');
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.usertable.findFirst({
    where: {
      Email: normalizedEmail,
      deleted_at: null,
    },
  });

  // Always return the same message to prevent email enumeration
  if (!user) {
    return { message: 'If the account exists, a password reset link has been sent.' };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.usertable.update({
    where: { UserID: user.UserID },
    data: {
      PasswordResetToken: resetToken,
      PasswordResetTokenExpiry: expiry,
    },
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.Email,
    subject: 'Reset your password',
    html: `
      <p>Hello ${user.Username || ''},</p>
      <p>We received a request to reset your password. Click the link below — it expires in 1 hour.</p>
      <p><a href="${resetUrl}" style="color:#007bff">Reset Password</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `,
  });

  return { message: 'If the account exists, a password reset link has been sent.' };
}
