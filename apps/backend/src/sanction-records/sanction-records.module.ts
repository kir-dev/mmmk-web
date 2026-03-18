import { Module } from '@nestjs/common';

import { SanctionRecordsController } from './sanction-records.controller';
import { SanctionRecordsService } from './sanction-records.service';

@Module({
  controllers: [SanctionRecordsController],
  providers: [SanctionRecordsService],
  exports: [SanctionRecordsService],
})
export class SanctionRecordsModule {}
