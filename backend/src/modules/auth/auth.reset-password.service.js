import bcrypt from 'bcrypt';
import prisma from '../../lib/prisma.js';

export async function resetPassword(token, newPassword) {
  if (!token || !newPassword) {
    throw new Error('Token and new password are required');
  }

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetTokenExpiry: {
        gt: new Date(),
      },
      deletedAt: null,
    },
  });

  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { userId: user.userId },
    data: {
      passwordHash,
      passwordResetToken: null,
      passwordResetTokenExpiry: null,
      lastPasswordChangeAt: new Date(),
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });

  return {
    message: 'Password reset successful',
  };
}