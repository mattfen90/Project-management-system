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
    await prisma.userrolestable.upsert({
      where: { UserRoleName: roleName },
      update: {},
      create: { UserRoleName: roleName },
    });
  }

  const adminRole = await prisma.userrolestable.findUnique({
    where: { UserRoleName: 'Admin' },
  });

  const hashedPassword = await bcrypt.hash('Admin12345!', 10);

  await prisma.usertable.upsert({
    where: { Email: 'admin@example.com' },
    update: {},
    create: {
      UserRoleID: adminRole.UserRoleID,
      Username: 'admin',
      PasswordHash: hashedPassword,
      Email: 'admin@example.com',
      EmailVerified: true,
      FailedLoginAttempts: 0,
      TwoFactorEnabled: false,
      AccountStatus: 'Active',
    },
  });

  await prisma.$disconnect();
  console.log('Seed completed');
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
