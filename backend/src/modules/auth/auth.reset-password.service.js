import bcrypt from 'bcrypt';
import prisma from '../../lib/prisma.js';

export async function resetPassword(token, newPassword) {
  if (!token || !newPassword) {
    throw new Error('Token and new password are required');
  }

  const user = await prisma.usertable.findFirst({
    where: {
      PasswordResetToken: token,
      PasswordResetTokenExpiry: {
        gt: new Date(),
      },
      deleted_at: null,
    },
  });

  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.usertable.update({
    where: { UserID: user.UserID },
    data: {
      PasswordHash: passwordHash,
      PasswordResetToken: null,
      PasswordResetTokenExpiry: null,
      LastPasswordChangeAt: new Date(),
      FailedLoginAttempts: 0,
      LockedUntil: null,
    },
  });

  return {
    message: 'Password reset successful',
  };
}
