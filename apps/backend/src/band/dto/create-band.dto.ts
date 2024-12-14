import { OmitType } from '@nestjs/swagger';

import { Band } from '../entities/band.entity';

export class CreateBandDto extends OmitType(Band, ['id']) {}
