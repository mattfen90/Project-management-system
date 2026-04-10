import crypto from 'crypto';
import prisma from '../../lib/prisma.js';

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

  if (!user) {
    return {
      message: 'If the account exists, a password reset link has been sent.',
    };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.usertable.update({
    where: { UserID: user.UserID },
    data: {
      PasswordResetToken: resetToken,
      PasswordResetTokenExpiry: expiry,
    },
  });

  return {
    message: 'If the account exists, a password reset link has been sent.',
    resetToken,
  };
}
