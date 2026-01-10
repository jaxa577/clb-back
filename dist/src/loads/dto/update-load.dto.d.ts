import { TruckType, PaymentType, LoadStatus } from '@prisma/client';
export declare class UpdateLoadDto {
    originCountry?: string;
    originCity?: string;
    destinationCountry?: string;
    destinationCity?: string;
    cargoType?: string;
    weight?: number;
    volume?: number;
    truckType?: TruckType;
    price?: number;
    paymentType?: PaymentType;
    loadingDate?: string;
    status?: LoadStatus;
}
