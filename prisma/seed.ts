import { PrismaClient, Role, LoadStatus, TruckType, PaymentType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

  // Create demo loads
  const loads = await Promise.all([
    prisma.load.create({
      data: {
        shipperId: users[1].id, // shipper1
        originCountry: 'Russia',
        originCity: 'Moscow',
        destinationCountry: 'Kazakhstan',
        destinationCity: 'Almaty',
        cargoType: 'Electronics',
        weight: 1500,
        volume: 20,
        truckType: TruckType.TENT,
        price: 25000,
        paymentType: PaymentType.CASH,
        loadingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: LoadStatus.OPEN,
      },
    }),
    prisma.load.create({
      data: {
        shipperId: users[1].id, // shipper1
        originCountry: 'Russia',
        originCity: 'Saint Petersburg',
        destinationCountry: 'Uzbekistan',
        destinationCity: 'Tashkent',
        cargoType: 'Textiles',
        weight: 800,
        volume: 15,
        truckType: TruckType.CONTAINER,
        price: 18000,
        paymentType: PaymentType.TRANSFER,
        loadingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        status: LoadStatus.OPEN,
      },
    }),
    prisma.load.create({
      data: {
        shipperId: users[2].id, // shipper2
        originCountry: 'Kazakhstan',
        originCity: 'Astana',
        destinationCountry: 'Russia',
        destinationCity: 'Ekaterinburg',
        cargoType: 'Machinery',
        weight: 3000,
        volume: 35,
        truckType: TruckType.PLATFORM,
        price: 35000,
        paymentType: PaymentType.CARD,
        loadingDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        status: LoadStatus.OPEN,
      },
    }),
    prisma.load.create({
      data: {
        shipperId: users[2].id, // shipper2
        originCountry: 'Uzbekistan',
        originCity: 'Samarkand',
        destinationCountry: 'Kyrgyzstan',
        destinationCity: 'Bishkek',
        cargoType: 'Food Products',
        weight: 1200,
        volume: 25,
        truckType: TruckType.REFRIGERATOR,
        price: 22000,
        paymentType: PaymentType.CASH,
        loadingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: LoadStatus.IN_PROGRESS,
      },
    }),
  ]);

  console.log('✅ Created demo loads');

  // Create demo applications
  await Promise.all([
    prisma.application.create({
      data: {
        loadId: loads[0].id,
        applicantId: users[3].id, // broker1
        role: Role.BROKER,
        status: 'PENDING',
      },
    }),
    prisma.application.create({
      data: {
        loadId: loads[0].id,
        applicantId: users[4].id, // driver1
        role: Role.DRIVER,
        status: 'PENDING',
      },
    }),
    prisma.application.create({
      data: {
        loadId: loads[1].id,
        applicantId: users[4].id, // driver1
        role: Role.DRIVER,
        status: 'ACCEPTED',
      },
    }),
  ]);

  console.log('✅ Created demo applications');

  // Create demo deals
  await Promise.all([
    prisma.deal.create({
      data: {
        loadId: loads[1].id,
        shipperId: users[1].id,
        driverId: users[4].id,
        agreedPrice: loads[1].price,
        commission: 0, // Driver deal, no commission
        status: 'ACTIVE',
      },
    }),
    prisma.deal.create({
      data: {
        loadId: loads[3].id,
        shipperId: users[2].id,
        driverId: users[4].id,
        brokerId: users[3].id,
        agreedPrice: loads[3].price,
        commission: loads[3].price * 0.05, // 5% broker commission
        status: 'COMPLETED',
      },
    }),
  ]);

  console.log('✅ Created demo deals');

  // Create demo messages
  await Promise.all([
    prisma.message.create({
      data: {
        senderId: users[1].id, // shipper1
        receiverId: users[4].id, // driver1
        content: 'Hello! I have a load from Moscow to Almaty. Are you interested?',
      },
    }),
    prisma.message.create({
      data: {
        senderId: users[4].id, // driver1
        receiverId: users[1].id, // shipper1
        content: 'Hi! Yes, I am available for this route. What are the loading details?',
      },
    }),
    prisma.message.create({
      data: {
        senderId: users[1].id, // shipper1
        receiverId: users[4].id, // driver1
        content: 'Loading is scheduled for next Monday at 9 AM. The cargo is electronics, weight 1.5 tons.',
      },
    }),
  ]);

  console.log('✅ Created demo messages');

  // Create demo reviews
  await Promise.all([
    prisma.review.create({
      data: {
        fromUserId: users[2].id, // shipper2
        toUserId: users[3].id, // broker1
        rating: 5,
        comment: 'Excellent broker! Very professional and reliable.',
      },
    }),
    prisma.review.create({
      data: {
        fromUserId: users[1].id, // shipper1
        toUserId: users[4].id, // driver1
        rating: 4,
        comment: 'Good driver, delivered on time. Minor delay but communicated well.',
      },
    }),
    prisma.review.create({
      data: {
        fromUserId: users[2].id, // shipper2
        toUserId: users[4].id, // driver1
        rating: 5,
        comment: 'Perfect delivery! Highly recommended.',
      },
    }),
  ]);

  console.log('✅ Created demo reviews');

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

