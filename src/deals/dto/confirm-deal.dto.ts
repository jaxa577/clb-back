import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmDealDto {
  @IsNotEmpty()
  @IsString()
  loadId: string;
}


