require('dotenv').config();

const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

async function main() {
  const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const prisma = new PrismaClient({ adapter });

  const roles = ['Admin', 'Owner', 'Project Manager', 'Client', 'Worker'];

  for (const roleName of roles) {
    await prisma.userRole.upsert({
      where: { userRoleName: roleName },
      update: {},
      create: { userRoleName: roleName },
    });
  }

  const adminRole = await prisma.userRole.findUnique({
    where: { userRoleName: 'Admin' },
  });

  const hashedPassword = await bcrypt.hash('Admin12345!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      userRoleId: adminRole.userRoleId,
      username: 'admin',
      passwordHash: hashedPassword,
      email: 'admin@example.com',
      emailVerified: true,
      failedLoginAttempts: 0,
      twoFactorEnabled: false,
      accountStatus: 'Active',
    },
  });

  await prisma.$disconnect();
  console.log('Seed completed');
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});