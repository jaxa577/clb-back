import { PrismaService } from '../prisma/prisma.service';
import { WebsocketsGateway } from '../websockets/websockets.gateway';
import { StartJourneyDto } from './dto/start-journey.dto';
import { LocationUpdateDto } from './dto/location-update.dto';
export declare class JourneysService {
    private prisma;
    private websocketsGateway;
    constructor(prisma: PrismaService, websocketsGateway: WebsocketsGateway);
    startJourney(dto: StartJourneyDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.JourneyStatus;
        loadId: string;
        driverId: string;
        updatedAt: Date;
        startTime: Date;
        endTime: Date | null;
        currentLatitude: number | null;
        currentLongitude: number | null;
    }>;
    stopJourney(journeyId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.JourneyStatus;
        loadId: string;
        driverId: string;
        updatedAt: Date;
        startTime: Date;
        endTime: Date | null;
        currentLatitude: number | null;
        currentLongitude: number | null;
    }>;
    updateLocation(dto: LocationUpdateDto): Promise<{
        success: boolean;
    }>;
    getActiveJourney(loadId: string): Promise<{
        locations: {
            id: string;
            createdAt: Date;
            journeyId: string;
            latitude: number;
            longitude: number;
            accuracy: number | null;
            speed: number | null;
            timestamp: bigint;
        }[];
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.JourneyStatus;
        loadId: string;
        driverId: string;
        updatedAt: Date;
        startTime: Date;
        endTime: Date | null;
        currentLatitude: number | null;
        currentLongitude: number | null;
    }>;
    getJourneyLocations(journeyId: string): Promise<{
        id: string;
        createdAt: Date;
        journeyId: string;
        latitude: number;
        longitude: number;
        accuracy: number | null;
        speed: number | null;
        timestamp: bigint;
    }[]>;
    getAllActiveJourneys(): Promise<({
        locations: {
            id: string;
            createdAt: Date;
            journeyId: string;
            latitude: number;
            longitude: number;
            accuracy: number | null;
            speed: number | null;
            timestamp: bigint;
        }[];
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.JourneyStatus;
        loadId: string;
        driverId: string;
        updatedAt: Date;
        startTime: Date;
        endTime: Date | null;
        currentLatitude: number | null;
        currentLongitude: number | null;
    })[]>;
    getActiveJourneysWithLoads(): Promise<{
        load: ({
            shipper: {
                id: string;
                name: string;
                phone: string | null;
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
        }) | null;
        locations: {
            id: string;
            createdAt: Date;
            journeyId: string;
            latitude: number;
            longitude: number;
            accuracy: number | null;
            speed: number | null;
            timestamp: bigint;
        }[];
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.JourneyStatus;
        loadId: string;
        driverId: string;
        updatedAt: Date;
        startTime: Date;
        endTime: Date | null;
        currentLatitude: number | null;
        currentLongitude: number | null;
    }[]>;
}
