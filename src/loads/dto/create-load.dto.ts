import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsDateString, IsArray } from 'class-validator';
import { TruckType, PaymentType } from '@prisma/client';

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

  @IsNumber()
  price: number;

  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @IsDateString()
  loadingDate: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];
}


