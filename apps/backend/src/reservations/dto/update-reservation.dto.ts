import { PartialType } from '@nestjs/mapped-types';
import { GateKeeperPriority } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

import { SimpleReservationDto } from './simple-reservation.dto';

export class UpdateReservationDto extends PartialType(SimpleReservationDto) {
  @IsNumber()
  @IsOptional()
  gateKeeperId?: number;

  @IsEnum(GateKeeperPriority)
  @IsOptional()
  gateKeeperPriority?: GateKeeperPriority;
}
