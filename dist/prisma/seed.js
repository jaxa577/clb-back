"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    const hashedPassword = await bcrypt.hash('password123', 12);
    const users = await Promise.all([
        prisma.user.upsert({
            where: { email: 'admin@sngloadboard.com' },
            update: {},
            create: {
                name: 'System Admin',
                email: 'admin@sngloadboard.com',
                password: hashedPassword,
                role: client_1.Role.ADMIN,
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
                role: client_1.Role.SHIPPER,
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
                role: client_1.Role.SHIPPER,
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
                role: client_1.Role.BROKER,
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
                role: client_1.Role.DRIVER,
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
                role: client_1.Role.DRIVER,
                phone: '+7-999-555-5555',
                rating: 4.5,
                verified: true,
            },
        }),
    ]);
    console.log('✅ Created demo users');
    const loads = await Promise.all([
        prisma.load.create({
            data: {
                shipperId: users[1].id,
                originCountry: 'Russia',
                originCity: 'Moscow',
                destinationCountry: 'Kazakhstan',
                destinationCity: 'Almaty',
                cargoType: 'Electronics',
                weight: 1500,
                volume: 20,
                truckType: client_1.TruckType.TENT,
                price: 25000,
                paymentType: client_1.PaymentType.CASH,
                loadingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                status: client_1.LoadStatus.OPEN,
            },
        }),
        prisma.load.create({
            data: {
                shipperId: users[1].id,
                originCountry: 'Russia',
                originCity: 'Saint Petersburg',
                destinationCountry: 'Uzbekistan',
                destinationCity: 'Tashkent',
                cargoType: 'Textiles',
                weight: 800,
                volume: 15,
                truckType: client_1.TruckType.CONTAINER,
                price: 18000,
                paymentType: client_1.PaymentType.TRANSFER,
                loadingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                status: client_1.LoadStatus.OPEN,
            },
        }),
        prisma.load.create({
            data: {
                shipperId: users[2].id,
                originCountry: 'Kazakhstan',
                originCity: 'Astana',
                destinationCountry: 'Russia',
                destinationCity: 'Ekaterinburg',
                cargoType: 'Machinery',
                weight: 3000,
                volume: 35,
                truckType: client_1.TruckType.PLATFORM,
                price: 35000,
                paymentType: client_1.PaymentType.CARD,
                loadingDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                status: client_1.LoadStatus.OPEN,
            },
        }),
        prisma.load.create({
            data: {
                shipperId: users[2].id,
                originCountry: 'Uzbekistan',
                originCity: 'Samarkand',
                destinationCountry: 'Kyrgyzstan',
                destinationCity: 'Bishkek',
                cargoType: 'Food Products',
                weight: 1200,
                volume: 25,
                truckType: client_1.TruckType.REFRIGERATOR,
                price: 22000,
                paymentType: client_1.PaymentType.CASH,
                loadingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                status: client_1.LoadStatus.IN_PROGRESS,
            },
        }),
    ]);
    console.log('✅ Created demo loads');
    await Promise.all([
        prisma.application.create({
            data: {
                loadId: loads[0].id,
                applicantId: users[3].id,
                role: client_1.Role.BROKER,
                status: 'PENDING',
            },
        }),
        prisma.application.create({
            data: {
                loadId: loads[0].id,
                applicantId: users[4].id,
                role: client_1.Role.DRIVER,
                status: 'PENDING',
            },
        }),
        prisma.application.create({
            data: {
                loadId: loads[1].id,
                applicantId: users[4].id,
                role: client_1.Role.DRIVER,
                status: 'ACCEPTED',
            },
        }),
    ]);
    console.log('✅ Created demo applications');
    await Promise.all([
        prisma.deal.create({
            data: {
                loadId: loads[1].id,
                shipperId: users[1].id,
                driverId: users[4].id,
                agreedPrice: loads[1].price ?? 0,
                commission: 0,
                status: 'ACTIVE',
            },
        }),
        prisma.deal.create({
            data: {
                loadId: loads[3].id,
                shipperId: users[2].id,
                driverId: users[4].id,
                brokerId: users[3].id,
                agreedPrice: loads[3].price ?? 0,
                commission: (loads[3].price ?? 0) * 0.05,
                status: 'COMPLETED',
            },
        }),
    ]);
    console.log('✅ Created demo deals');
    await Promise.all([
        prisma.message.create({
            data: {
                senderId: users[1].id,
                receiverId: users[4].id,
                content: 'Hello! I have a load from Moscow to Almaty. Are you interested?',
            },
        }),
        prisma.message.create({
            data: {
                senderId: users[4].id,
                receiverId: users[1].id,
                content: 'Hi! Yes, I am available for this route. What are the loading details?',
            },
        }),
        prisma.message.create({
            data: {
                senderId: users[1].id,
                receiverId: users[4].id,
                content: 'Loading is scheduled for next Monday at 9 AM. The cargo is electronics, weight 1.5 tons.',
            },
        }),
    ]);
    console.log('✅ Created demo messages');
    await Promise.all([
        prisma.review.create({
            data: {
                fromUserId: users[2].id,
                toUserId: users[3].id,
                rating: 5,
                comment: 'Excellent broker! Very professional and reliable.',
            },
        }),
        prisma.review.create({
            data: {
                fromUserId: users[1].id,
                toUserId: users[4].id,
                rating: 4,
                comment: 'Good driver, delivered on time. Minor delay but communicated well.',
            },
        }),
        prisma.review.create({
            data: {
                fromUserId: users[2].id,
                toUserId: users[4].id,
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
//# sourceMappingURL=seed.js.map