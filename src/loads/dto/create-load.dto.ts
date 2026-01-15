import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsDateString, IsBoolean, IsInt } from 'class-validator';
import { TruckType, PaymentType, Priority } from '@prisma/client';

export class CreateLoadDto {
  @IsNotEmpty()
  @IsString()
  originCountry: string;

  @IsNotEmpty()
  @IsString()
  originCity: string;

  @IsNotEmpty()
  @IsString()
  destinationCountry: string;

  @IsNotEmpty()
  @IsString()
  destinationCity: string;

  @IsNotEmpty()
  @IsString()
  cargoType: string;

  @IsNumber()
  weight: number;

  @IsOptional()
  @IsNumber()
  volume?: number;

  @IsEnum(TruckType)
  truckType: TruckType;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsBoolean()
  negotiablePrice?: boolean;

  @IsOptional()
  @IsNumber()
  prepayment?: number;

  @IsOptional()
  @IsString()
  prepaymentCurrency?: string;

  @IsOptional()
  @IsInt()
  trucksCount?: number;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @IsDateString()
  loadingDate: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;
}


