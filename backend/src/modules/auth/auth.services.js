import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma.js';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 30;

export async function loginUser(req) {
  const { identifier, password } = req.body;
  const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

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

  // Check lockout
  if (user.LockedUntil && new Date(user.LockedUntil) > new Date()) {
    await prisma.userlogintable.create({
      data: {
        UserID: user.UserID,
        IPAddress: ipAddress,
        Success: false,
        UserAgent: userAgent,
        FailureReason: 'Account locked',
      },
    });
    throw new Error('ACCOUNT_LOCKED');
  }

  if (user.AccountStatus !== 'Active') {
    await prisma.userlogintable.create({
      data: {
        UserID: user.UserID,
        IPAddress: ipAddress,
        Success: false,
        UserAgent: userAgent,
        FailureReason: 'Account inactive',
      },
    });
    throw new Error('ACCOUNT_INACTIVE');
  }

  const passwordMatch = await bcrypt.compare(password, user.PasswordHash);

  if (!passwordMatch) {
    const newFailedCount = (user.FailedLoginAttempts || 0) + 1;
    const shouldLock = newFailedCount >= MAX_FAILED_ATTEMPTS;
    const lockedUntil = shouldLock
      ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
      : null;

    await prisma.usertable.update({
      where: { UserID: user.UserID },
      data: {
        FailedLoginAttempts: newFailedCount,
        ...(shouldLock && { LockedUntil: lockedUntil }),
      },
    });

    await prisma.userlogintable.create({
      data: {
        UserID: user.UserID,
        IPAddress: ipAddress,
        Success: false,
        UserAgent: userAgent,
        FailureReason: shouldLock ? 'Too many failed attempts — account locked' : 'Invalid password',
      },
    });

    throw new Error(shouldLock ? 'ACCOUNT_LOCKED' : 'INVALID_CREDENTIALS');
  }

  // Successful login
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
      LockedUntil: null,
    },
  });

  await prisma.userlogintable.create({
    data: {
      UserID: user.UserID,
      IPAddress: ipAddress,
      Success: true,
      UserAgent: userAgent,
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
