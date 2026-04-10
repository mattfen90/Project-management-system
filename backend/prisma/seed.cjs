const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');

async function main() {
  const connection = await mariadb.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.MYSQL_ROOT_PASSWORD || 'yourpassword',
    database: 'project_managemenet_db',  // your DB name
  });

  const adapter = new PrismaMariaDb(connection);
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

  const password = 'Admin12345!';
  const hashedPassword = await bcrypt.hash(password, 10);

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
  console.log('Seed completed. Test login: admin / Admin12345!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });