import { OmitType } from '@nestjs/swagger';

import { Reservation } from '../entities/reservation.entity';

export class CreateReservationDto extends OmitType(Reservation, ['id', 'userId']) {}
