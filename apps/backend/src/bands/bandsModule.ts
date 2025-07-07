import { Module } from '@nestjs/common';

import { BandsService } from './bands.service';
import { BandsController } from './bandsController';

@Module({
  controllers: [BandsController],
  providers: [BandsService],
})
export class BandsModule {}
