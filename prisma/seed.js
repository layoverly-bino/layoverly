const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Neon database...');

  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@layoverly.com' },
    update: {},
    create: {
      email: 'admin@layoverly.com',
      name: 'Executive Admin',
      passwordHash: 'layover2026', // Replace with bcrypt hash in production
      role: 'ADMIN',
    },
  });

  // 2. Create Guide User & Guide Profile
  const guideUser = await prisma.user.upsert({
    where: { email: 'guide@layoverly.com' },
    update: {},
    create: {
      email: 'guide@layoverly.com',
      name: 'Elena Rostova',
      passwordHash: 'guide2026',
      role: 'GUIDE',
      guideProfile: {
        create: {
          languages: ['English', 'Amharic', 'French'],
          hasVehicle: true,
          vehicleDetails: 'Toyota EV Sedan',
          isVerified: true,
          isAvailable: true,
          pricePerHour: 25.0,
        },
      },
    },
  });

  // 3. Create Traveler User
  const travelerUser = await prisma.user.upsert({
    where: { email: 'traveler@layoverly.com' },
    update: {},
    create: {
      email: 'traveler@layoverly.com',
      name: 'Sarah Jenkins',
      passwordHash: 'traveler2026',
      role: 'TRAVELER',
    },
  });

  console.log('Database seeded successfully!');
  console.log({ admin: admin.email, guide: guideUser.email, traveler: travelerUser.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });