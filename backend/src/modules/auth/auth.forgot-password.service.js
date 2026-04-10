import crypto from 'crypto';
import prisma from '../../lib/prisma.js';

export async function forgotPassword(email) {
  if (!email) {
    throw new Error('Email is required');
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
  });

  if (!user) {
    return {
      message: 'If the account exists, a password reset link has been sent.',
    };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.user.update({
    where: { userId: user.userId },
    data: {
      passwordResetToken: resetToken,
      passwordResetTokenExpiry: expiry,
    },
  });

  return {
    message: 'If the account exists, a password reset link has been sent.',
    resetToken,
  };
}