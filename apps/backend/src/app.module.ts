import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BandModule } from './band/band.module';

@Module({
  imports: [PrismaModule.forRoot({ isGlobal: true }), BandModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
