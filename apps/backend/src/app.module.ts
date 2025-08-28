import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BandsModule } from './bands/bandsModule';
import { CommentsModule } from './comments/comments.module';
import { MembershipsModule } from './memberships/memberships.module';
import { PostsModule } from './posts/posts.module';
import { ReservationsModule } from './reservations/reservations.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule.forRoot({ isGlobal: true }),

    UsersModule,

    ReservationsModule,

    CommentsModule,

    BandsModule,
    AuthModule,
    MembershipsModule,
    ,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
