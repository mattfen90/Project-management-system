import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma.js';

export async function loginUser(req) {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    throw new Error('MISSING_FIELDS');
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: identifier },
        { email: identifier },
      ],
      deletedAt: null,
    },
    include: {
      role: true,  // ✅ Fixed: use 'role', not 'userRole'
    },
  });

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
    throw new Error('ACCOUNT_LOCKED');
  }

  if (user.accountStatus !== 'Active') {
    throw new Error('ACCOUNT_INACTIVE');
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const token = jwt.sign(
    {
      userId: user.userId,
      role: user.role.userRoleName,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  await prisma.user.update({
    where: { userId: user.userId },
    data: {
      lastLoginAt: new Date(),
      failedLoginAttempts: 0,
    },
  });

  return {
    token,
    user: {
      userId: user.userId,
      username: user.username,
      email: user.email,
      role: user.role.userRoleName,
    },
  };
}