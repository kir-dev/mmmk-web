import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';

import { SimpleReservationDto } from './simple-reservation.dto';

export class UpdateReservationDto extends PartialType(SimpleReservationDto) {
  @IsNumber()
  @IsOptional()
  gateKeeperId?: number;
}
