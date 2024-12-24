import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class User {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  authSchId?: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsEnum(Role)
  role: Role;
}
