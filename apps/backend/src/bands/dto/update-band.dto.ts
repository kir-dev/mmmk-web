import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';

import { CreateBandDto } from './create-band.dto';

export class UpdateBandDto extends PartialType(CreateBandDto) {
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}
