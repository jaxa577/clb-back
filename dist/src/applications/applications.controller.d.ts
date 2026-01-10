import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
    create(createApplicationDto: CreateApplicationDto, req: any): Promise<{
        load: {
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
    accept(id: string, req: any): Promise<{
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
                createdAt: Date;
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
    reject(id: string, req: any): Promise<{
        load: {
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
    getUserApplications(req: any): Promise<({
        load: {
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
