import { DealsService } from './deals.service';
import { ConfirmDealDto } from './dto/confirm-deal.dto';
export declare class DealsController {
    private readonly dealsService;
    constructor(dealsService: DealsService);
    confirm(confirmDealDto: ConfirmDealDto, req: any): Promise<{
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
        load: {
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
        driver: {
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
        broker: {
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.DealStatus;
        shipperId: string;
        loadId: string;
        agreedPrice: number;
        commission: number;
        driverId: string;
        brokerId: string | null;
    }>;
    getUserDeals(req: any): Promise<({
        shipper: {
            id: string;
            name: string;
            rating: number;
        };
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
        driver: {
            id: string;
            name: string;
            rating: number;
        };
        broker: {
            id: string;
            name: string;
            rating: number;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.DealStatus;
        shipperId: string;
        loadId: string;
        agreedPrice: number;
        commission: number;
        driverId: string;
        brokerId: string | null;
    })[]>;
}
