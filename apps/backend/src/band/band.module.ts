import { Module } from '@nestjs/common';

import { BandController } from './band.controller';
import { BandService } from './band.service';

@Module({
  controllers: [BandController],
  providers: [BandService],
})
export class BandModule {}
