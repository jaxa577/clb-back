import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsString()
  loadId: string;

  @IsEnum(Role)
  role: Role;
}


