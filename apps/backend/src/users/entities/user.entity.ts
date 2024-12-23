import { ProfilePicture, Role } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
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
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsBoolean()
  @IsOptional()
  isDormResident?: boolean;

  @IsInt()
  @IsPositive()
  @IsOptional()
  dormRoomNumber?: number;

  @IsOptional()
  profilePicture?: ProfilePicture;

  @IsEnum(Role)
  role: Role;

  @IsBoolean()
  roomAccess: boolean;
}
