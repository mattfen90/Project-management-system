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

  const hash = await bcrypt.hash('Admin12345!', 10);

  await prisma.usertable.update({
    where: { Email: 'admin@example.com' },
    data: {
      PasswordHash: hash,
      AccountStatus: 'Active',
      EmailVerified: true,
    },
  });

  console.log('Password updated successfully');
  await prisma.$disconnect();
}

main().catch(console.error);