import { TruckType, PaymentType, Priority } from '@prisma/client';
export declare class CreateLoadDto {
    originCountry: string;
    originCity: string;
    originLatitude?: number;
    originLongitude?: number;
    destinationCountry: string;
    destinationCity: string;
    destinationLatitude?: number;
    destinationLongitude?: number;
    cargoType: string;
    weight: number;
    volume?: number;
    truckType: TruckType;
    price?: number;
    currency?: string;
    negotiablePrice?: boolean;
    prepayment?: number;
    prepaymentCurrency?: string;
    trucksCount?: number;
    priority?: Priority;
    paymentType: PaymentType;
    loadingDate: string;
    contactPhone?: string;
}
