import { GateKeeperPriority, ReservationStatus } from '@prisma/client';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class Reservation {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNumber()
  @IsOptional()
  userId: number;

  @IsOptional()
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

  @IsOptional()
  @IsEnum(GateKeeperPriority)
  gateKeeperPriority: GateKeeperPriority;

  @IsOptional()
  @IsEnum(ReservationStatus)
  status: ReservationStatus;

  @IsBoolean()
  needToBeLetIn: boolean;
}
