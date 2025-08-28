import { ReservationStatus } from '@prisma/client';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class Reservation {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  bandId: number;

  @IsNotEmpty()
  @IsDate()
  startTime: Date;

  @IsNotEmpty()
  @IsDate()
  endTime: Date;

  @IsNumber()
  @IsOptional()
  gateKeeperId: number;

  @IsNotEmpty()
  @IsEnum(ReservationStatus)
  status: ReservationStatus;
}
