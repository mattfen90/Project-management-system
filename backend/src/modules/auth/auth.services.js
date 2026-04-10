import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma.js';

export async function loginUser(req) {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    throw new Error('MISSING_FIELDS');
  }

  const user = await prisma.usertable.findFirst({
    where: {
      OR: [
        { Username: identifier },
        { Email: identifier },
      ],
      deleted_at: null,
    },
    include: {
      userrolestable: true,
    },
  });

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  if (user.LockedUntil && new Date(user.LockedUntil) > new Date()) {
    throw new Error('ACCOUNT_LOCKED');
  }

  if (user.AccountStatus !== 'Active') {
    throw new Error('ACCOUNT_INACTIVE');
  }

  const passwordMatch = await bcrypt.compare(password, user.PasswordHash);

  if (!passwordMatch) {
    await prisma.usertable.update({
      where: { UserID: user.UserID },
      data: { FailedLoginAttempts: { increment: 1 } },
    });
    throw new Error('INVALID_CREDENTIALS');
  }

  const token = jwt.sign(
    {
      userId: user.UserID.toString(),
      role: user.userrolestable.UserRoleName,
      email: user.Email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  await prisma.usertable.update({
    where: { UserID: user.UserID },
    data: {
      LastLoginAt: new Date(),
      FailedLoginAttempts: 0,
    },
  });

  return {
    token,
    user: {
      userId: user.UserID.toString(),
      username: user.Username,
      email: user.Email,
      role: user.userrolestable.UserRoleName,
    },
  };
}
