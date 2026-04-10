import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorised — no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4.4: Re-check account status on every request so locked/disabled accounts
    // are blocked immediately without waiting for token expiry
    const user = await prisma.usertable.findFirst({
      where: { UserID: Number(decoded.id), deleted_at: null },
      select: { AccountStatus: true, LockedUntil: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorised — account not found' });
    }

    if (user.AccountStatus === 'Disabled') {
      return res.status(403).json({ message: 'Your account has been disabled. Please contact support.' });
    }

    if (user.AccountStatus === 'Locked') {
      if (user.LockedUntil && new Date() < new Date(user.LockedUntil)) {
        return res.status(403).json({ message: 'Your account is temporarily locked. Please try again later.' });
      }
      // Lock period expired — auto-unlock and proceed
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorised — invalid or expired token' });
  }
}
