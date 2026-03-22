import { PartialType } from '@nestjs/mapped-types';

import { SimpleReservationDto } from './simple-reservation.dto';

export class UpdateReservationDto extends PartialType(SimpleReservationDto) {}
