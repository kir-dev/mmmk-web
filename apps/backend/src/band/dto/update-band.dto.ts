import { PartialType } from '@nestjs/mapped-types';

import { CreateBandDto } from './create-band.dto';

export class UpdateBandDto extends PartialType(CreateBandDto) {}
