const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const Role = {
  SHIPPER: 'SHIPPER',
  BROKER: 'BROKER',
  DRIVER: 'DRIVER',
  ADMIN: 'ADMIN'
};

const LoadStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  ARCHIVED: 'ARCHIVED'
};

const TruckType = {
  TENT: 'TENT',
  REFRIGERATOR: 'REFRIGERATOR',
  CONTAINER: 'CONTAINER',
  PLATFORM: 'PLATFORM',
  TANK: 'TANK'
};

const PaymentType = {
  CASH: 'CASH',
  CARD: 'CARD',
  TRANSFER: 'TRANSFER'
};

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@sngloadboard.com' },
      update: {},
      create: {
        name: 'System Admin',
        email: 'admin@sngloadboard.com',
        password: hashedPassword,
        role: Role.ADMIN,
        phone: '+7-999-000-0000',
        rating: 5.0,
        verified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'shipper1@example.com' },
      update: {},
      create: {
        name: 'Alexey Ivanov',
        email: 'shipper1@example.com',
        password: hashedPassword,
        role: Role.SHIPPER,
        phone: '+7-999-111-1111',
        rating: 4.8,
        verified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'shipper2@example.com' },
      update: {},
      create: {
        name: 'Maria Petrova',
        email: 'shipper2@example.com',
        password: hashedPassword,
        role: Role.SHIPPER,
        phone: '+7-999-222-2222',
        rating: 4.6,
        verified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'broker1@example.com' },
      update: {},
      create: {
        name: 'Sergey Kuznetsov',
        email: 'broker1@example.com',
        password: hashedPassword,
        role: Role.BROKER,
        phone: '+7-999-333-3333',
        rating: 4.7,
        verified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'driver1@example.com' },
      update: {},
      create: {
        name: 'Dmitry Sokolov',
        email: 'driver1@example.com',
        password: hashedPassword,
        role: Role.DRIVER,
        phone: '+7-999-444-4444',
        rating: 4.9,
        verified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'driver2@example.com' },
      update: {},
      create: {
        name: 'Elena Volkova',
        email: 'driver2@example.com',
        password: hashedPassword,
        role: Role.DRIVER,
        phone: '+7-999-555-5555',
        rating: 4.5,
        verified: true,
      },
    }),
  ]);

  console.log('✅ Created demo users');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Demo Accounts:');
  console.log('Admin: admin@sngloadboard.com / password123');
  console.log('Shipper: shipper1@example.com / password123');
  console.log('Shipper: shipper2@example.com / password123');
  console.log('Broker: broker1@example.com / password123');
  console.log('Driver: driver1@example.com / password123');
  console.log('Driver: driver2@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
