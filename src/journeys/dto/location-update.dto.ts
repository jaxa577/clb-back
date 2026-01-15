import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LocationUpdateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  journeyId: string;

  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  longitude: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  accuracy?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  speed?: number;

  @ApiProperty()
  @IsNumber()
  timestamp: number;
}
