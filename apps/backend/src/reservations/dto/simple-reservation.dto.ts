import { OmitType } from '@nestjs/swagger';

import { Reservation } from '../entities/reservation.entity';

export class SimpleReservationDto extends OmitType(Reservation, ['id', 'userId']) {}
