import { Module } from '@nestjs/common';

import { OpenedWeeksController } from './opened-weeks.controller';
import { OpenedWeeksService } from './opened-weeks.service';

@Module({
  providers: [OpenedWeeksService],
  controllers: [OpenedWeeksController],
})
export class OpenedWeeksModule {}
