import { PrismaService } from '../prisma/prisma.service';
import { CreateLoadDto } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';
import { Role } from '@prisma/client';
export declare class LoadsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createLoadDto: CreateLoadDto, userId: string): Promise<{
        shipper: {
            id: string;
            email: string;
            name: string;
            rating: number;
        };
    } & {
        id: string;
        createdAt: Date;
        originCountry: string;
        originCity: string;
        destinationCountry: string;
        destinationCity: string;
        cargoType: string;
        weight: number;
        volume: number | null;
        truckType: import(".prisma/client").$Enums.TruckType;
        price: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        loadingDate: Date;
        status: import(".prisma/client").$Enums.LoadStatus;
        shipperId: string;
    }>;
    findAll(query?: any): Promise<{
        loads: ({
            applications: {
                id: string;
                status: import(".prisma/client").$Enums.ApplicationStatus;
                applicant: {
                    id: string;
                    role: import(".prisma/client").$Enums.Role;
                    name: string;
                    rating: number;
                };
            }[];
            shipper: {
                id: string;
                name: string;
                rating: number;
            };
        } & {
            id: string;
            createdAt: Date;
            originCountry: string;
            originCity: string;
            destinationCountry: string;
            destinationCity: string;
            cargoType: string;
            weight: number;
            volume: number | null;
            truckType: import(".prisma/client").$Enums.TruckType;
            price: number;
            paymentType: import(".prisma/client").$Enums.PaymentType;
            loadingDate: Date;
            status: import(".prisma/client").$Enums.LoadStatus;
            shipperId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: string): Promise<{
        applications: ({
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
        })[];
        shipper: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            rating: number;
        };
    } & {
        id: string;
        createdAt: Date;
        originCountry: string;
        originCity: string;
        destinationCountry: string;
        destinationCity: string;
        cargoType: string;
        weight: number;
        volume: number | null;
        truckType: import(".prisma/client").$Enums.TruckType;
        price: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        loadingDate: Date;
        status: import(".prisma/client").$Enums.LoadStatus;
        shipperId: string;
    }>;
    update(id: string, updateLoadDto: UpdateLoadDto, userId: string, userRole: Role): Promise<{
        shipper: {
            id: string;
            name: string;
            rating: number;
        };
    } & {
        id: string;
        createdAt: Date;
        originCountry: string;
        originCity: string;
        destinationCountry: string;
        destinationCity: string;
        cargoType: string;
        weight: number;
        volume: number | null;
        truckType: import(".prisma/client").$Enums.TruckType;
        price: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        loadingDate: Date;
        status: import(".prisma/client").$Enums.LoadStatus;
        shipperId: string;
    }>;
    remove(id: string, userId: string, userRole: Role): Promise<{
        id: string;
        createdAt: Date;
        originCountry: string;
        originCity: string;
        destinationCountry: string;
        destinationCity: string;
        cargoType: string;
        weight: number;
        volume: number | null;
        truckType: import(".prisma/client").$Enums.TruckType;
        price: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        loadingDate: Date;
        status: import(".prisma/client").$Enums.LoadStatus;
        shipperId: string;
    }>;
    getLoadApplications(loadId: string, userId: string, userRole: Role): Promise<({
        applicant: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            name: string;
            phone: string | null;
            rating: number;
        };
    } & {
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        loadId: string;
        applicantId: string;
    })[]>;
    getUserLoads(userId: string, userRole: Role): Promise<({
        applications: {
            id: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            loadId: string;
            applicantId: string;
        }[];
        shipper: {
            id: string;
            name: string;
            rating: number;
        };
    } & {
        id: string;
        createdAt: Date;
        originCountry: string;
        originCity: string;
        destinationCountry: string;
        destinationCity: string;
        cargoType: string;
        weight: number;
        volume: number | null;
        truckType: import(".prisma/client").$Enums.TruckType;
        price: number;
        paymentType: import(".prisma/client").$Enums.PaymentType;
        loadingDate: Date;
        status: import(".prisma/client").$Enums.LoadStatus;
        shipperId: string;
    })[]>;
}
