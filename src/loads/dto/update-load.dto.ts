import { IsOptional, IsString, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { TruckType, PaymentType, LoadStatus } from '@prisma/client';

export class UpdateLoadDto {
  @IsOptional()
  @IsString()
  originCountry?: string;

  @IsOptional()
  @IsString()
  originCity?: string;

  @IsOptional()
  @IsString()
  destinationCountry?: string;

  @IsOptional()
  @IsString()
  destinationCity?: string;

  @IsOptional()
  @IsString()
  cargoType?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  volume?: number;

  @IsOptional()
  @IsEnum(TruckType)
  truckType?: TruckType;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsEnum(PaymentType)
  paymentType?: PaymentType;

  @IsOptional()
  @IsDateString()
  loadingDate?: string;

  @IsOptional()
  @IsEnum(LoadStatus)
  status?: LoadStatus;
}


