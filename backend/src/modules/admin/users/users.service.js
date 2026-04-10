import bcrypt from 'bcrypt';
import prisma from '../../../lib/prisma.js';

const SALT_ROUNDS = 10;

export async function getAllUsers({ page = 1, limit = 20, search = '', role = '', status = '' }) {
  const skip = (page - 1) * limit;

  const where = {
    deleted_at: null,
    ...(search && {
      OR: [
        { Username: { contains: search, mode: 'insensitive' } },
        { Email: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(role && { userrolestable: { UserRoleName: role } }),
    ...(status && { AccountStatus: status }),
  };

  const [users, total] = await Promise.all([
    prisma.usertable.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      select: {
        UserID: true,
        Username: true,
        Email: true,
        EmailVerified: true,
        AccountStatus: true,
        LastLoginAt: true,
        created_at: true,
        userrolestable: { select: { UserRoleID: true, UserRoleName: true } },
      },
    }),
    prisma.usertable.count({ where }),
  ]);

  return { users, total, page, limit };
}

export async function getUserById(id) {
  const user = await prisma.usertable.findFirst({
    where: { UserID: Number(id), deleted_at: null },
    select: {
      UserID: true,
      Username: true,
      Email: true,
      EmailVerified: true,
      AccountStatus: true,
      FailedLoginAttempts: true,
      LockedUntil: true,
      LastLoginAt: true,
      LastPasswordChangeAt: true,
      TwoFactorEnabled: true,
      created_at: true,
      updated_at: true,
      userrolestable: { select: { UserRoleID: true, UserRoleName: true } },
    },
  });

  if (!user) throw new Error('USER_NOT_FOUND');
  return user;
}

export async function createUser({ username, email, password, roleId, accountStatus = 'Pending Verification' }) {
  if (!username || !email || !password || !roleId) throw new Error('MISSING_FIELDS');

  const existing = await prisma.usertable.findFirst({
    where: { OR: [{ Username: username }, { Email: email }], deleted_at: null },
  });
  if (existing) throw new Error('USER_ALREADY_EXISTS');

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  return prisma.usertable.create({
    data: {
      Username: username,
      Email: email,
      PasswordHash: passwordHash,
      UserRoleID: Number(roleId),
      AccountStatus: accountStatus,
      EmailVerified: false,
      FailedLoginAttempts: 0,
      TwoFactorEnabled: false,
    },
    select: {
      UserID: true,
      Username: true,
      Email: true,
      AccountStatus: true,
      userrolestable: { select: { UserRoleID: true, UserRoleName: true } },
    },
  });
}

export async function updateUser(id, { username, email, password, roleId, accountStatus }) {
  const user = await prisma.usertable.findFirst({
    where: { UserID: Number(id), deleted_at: null },
  });
  if (!user) throw new Error('USER_NOT_FOUND');

  const data = {};
  if (username) data.Username = username;
  if (email) data.Email = email;
  if (roleId) data.UserRoleID = Number(roleId);
  if (accountStatus) data.AccountStatus = accountStatus;
  if (password) {
    data.PasswordHash = await bcrypt.hash(password, SALT_ROUNDS);
    data.LastPasswordChangeAt = new Date();
  }

  return prisma.usertable.update({
    where: { UserID: Number(id) },
    data,
    select: {
      UserID: true,
      Username: true,
      Email: true,
      AccountStatus: true,
      userrolestable: { select: { UserRoleID: true, UserRoleName: true } },
    },
  });
}

export async function deleteUser(id) {
  const user = await prisma.usertable.findFirst({
    where: { UserID: Number(id), deleted_at: null },
  });
  if (!user) throw new Error('USER_NOT_FOUND');

  return prisma.usertable.update({
    where: { UserID: Number(id) },
    data: { deleted_at: new Date() },
  });
}

export async function getRoles() {
  return prisma.userrolestable.findMany({
    select: { UserRoleID: true, UserRoleName: true },
    orderBy: { UserRoleName: 'asc' },
  });
}