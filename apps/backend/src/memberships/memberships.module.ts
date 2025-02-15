import { Module } from '@nestjs/common';

import { MembershipsController } from './memberships.controller';
import { MembershipsService } from './memberships.service';

@Module({
  controllers: [MembershipsController],
  providers: [MembershipsService],
})
export class MembershipsModule {}
