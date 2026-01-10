import { LoadsService } from './loads.service';
import { CreateLoadDto } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';
export declare class LoadsController {
    private readonly loadsService;
    constructor(loadsService: LoadsService);
    create(createLoadDto: CreateLoadDto, req: any): Promise<{
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
    findAll(query: any): Promise<{
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
    getUserLoads(req: any): Promise<({
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
    update(id: string, updateLoadDto: UpdateLoadDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
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
    getApplications(loadId: string, req: any): Promise<({
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
}
