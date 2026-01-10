import { TruckType, PaymentType } from '@prisma/client';
export declare class CreateLoadDto {
    originCountry: string;
    originCity: string;
    destinationCountry: string;
    destinationCity: string;
    cargoType: string;
    weight: number;
    volume?: number;
    truckType: TruckType;
    price: number;
    paymentType: PaymentType;
    loadingDate: string;
}
