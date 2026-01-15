import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartJourneyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  loadId: string;
}
