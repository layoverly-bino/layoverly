import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  
  await prisma.user.update({
    where: { email: 'biniibex@gmail.com' },
    data: {
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  });
  
  console.log('✅ Password successfully reset to: Admin123!');
}

main().finally(() => prisma.$disconnect());