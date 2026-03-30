import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Role } from '@prisma/client';
import { MessagesService } from '../messages/messages.service';
export declare class ApplicationsService {
    private prisma;
    private messagesService;
    constructor(prisma: PrismaService, messagesService: MessagesService);
    create(createApplicationDto: CreateApplicationDto, userId: string): Promise<{
        load: {
            shipper: {
                id: string;
                name: string;
                rating: number;
            };
        } & {
            id: string;
            createdAt: Date;
            displayId: string | null;
            originCountry: string;
            originCity: string;
            originRegion: string | null;
            originLatitude: number | null;
            originLongitude: number | null;
            destinationCountry: string;
            destinationCity: string;
            destinationRegion: string | null;
            destinationLatitude: number | null;
            destinationLongitude: number | null;
            cargoType: string;
            weight: number;
            volume: number | null;
            truckType: import(".prisma/client").$Enums.TruckType;
            price: number | null;
            currency: string;
            negotiablePrice: boolean;
            prepayment: number | null;
            prepaymentCurrency: string | null;
            trucksCount: number | null;
            priority: import(".prisma/client").$Enums.Priority;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            loadingDate: Date;
            deliveryDate: Date | null;
            contactPhone: string | null;
            status: import(".prisma/client").$Enums.LoadStatus;
            shipperId: string;
        };
        applicant: {
            id: string;
            role: import(".prisma/client").$Enums.Role;
            name: string;
            rating: number;
        };
    } & {
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        loadId: string;
        applicantId: string;
    }>;
    accept(id: string, userId: string, userRole: Role): Promise<{
        load: {
            shipper: {
                id: string;
                email: string;
                role: import(".prisma/client").$Enums.Role;
                name: string;
                password: string;
                phone: string | null;
                rating: number;
                verified: boolean;
                telegramChatId: string | null;
                createdAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            displayId: string | null;
            originCountry: string;
            originCity: string;
            originRegion: string | null;
            originLatitude: number | null;
            originLongitude: number | null;
            destinationCountry: string;
            destinationCity: string;
            destinationRegion: string | null;
            destinationLatitude: number | null;
            destinationLongitude: number | null;
            cargoType: string;
            weight: number;
            volume: number | null;
            truckType: import(".prisma/client").$Enums.TruckType;
            price: number | null;
            currency: string;
            negotiablePrice: boolean;
            prepayment: number | null;
            prepaymentCurrency: string | null;
            trucksCount: number | null;
            priority: import(".prisma/client").$Enums.Priority;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            loadingDate: Date;
            deliveryDate: Date | null;
            contactPhone: string | null;
            status: import(".prisma/client").$Enums.LoadStatus;
            shipperId: string;
        };
        applicant: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            name: string;
            password: string;
            phone: string | null;
            rating: number;
            verified: boolean;
            telegramChatId: string | null;
            createdAt: Date;
        };
    } & {
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        loadId: string;
        applicantId: string;
    }>;
    reject(id: string, userId: string, userRole: Role): Promise<{
        load: {
            shipper: {
                id: string;
                name: string;
                rating: number;
            };
        } & {
            id: string;
            createdAt: Date;
            displayId: string | null;
            originCountry: string;
            originCity: string;
            originRegion: string | null;
            originLatitude: number | null;
            originLongitude: number | null;
            destinationCountry: string;
            destinationCity: string;
            destinationRegion: string | null;
            destinationLatitude: number | null;
            destinationLongitude: number | null;
            cargoType: string;
            weight: number;
            volume: number | null;
            truckType: import(".prisma/client").$Enums.TruckType;
            price: number | null;
            currency: string;
            negotiablePrice: boolean;
            prepayment: number | null;
            prepaymentCurrency: string | null;
            trucksCount: number | null;
            priority: import(".prisma/client").$Enums.Priority;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            loadingDate: Date;
            deliveryDate: Date | null;
            contactPhone: string | null;
            status: import(".prisma/client").$Enums.LoadStatus;
            shipperId: string;
        };
        applicant: {
            id: string;
            role: import(".prisma/client").$Enums.Role;
            name: string;
            rating: number;
        };
    } & {
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        loadId: string;
        applicantId: string;
    }>;
    private createDeal;
    getUserApplications(userId: string): Promise<({
        load: {
            shipper: {
                id: string;
                name: string;
                rating: number;
            };
        } & {
            id: string;
            createdAt: Date;
            displayId: string | null;
            originCountry: string;
            originCity: string;
            originRegion: string | null;
            originLatitude: number | null;
            originLongitude: number | null;
            destinationCountry: string;
            destinationCity: string;
            destinationRegion: string | null;
            destinationLatitude: number | null;
            destinationLongitude: number | null;
            cargoType: string;
            weight: number;
            volume: number | null;
            truckType: import(".prisma/client").$Enums.TruckType;
            price: number | null;
            currency: string;
            negotiablePrice: boolean;
            prepayment: number | null;
            prepaymentCurrency: string | null;
            trucksCount: number | null;
            priority: import(".prisma/client").$Enums.Priority;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            loadingDate: Date;
            deliveryDate: Date | null;
            contactPhone: string | null;
            status: import(".prisma/client").$Enums.LoadStatus;
            shipperId: string;
        };
    } & {
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        loadId: string;
        applicantId: string;
    })[]>;
}
