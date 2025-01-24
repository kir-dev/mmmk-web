import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

const cors = require('cors');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // DTO automatikus átalakítása
      transformOptions: {
        enableImplicitConversion: true, // Implicit típuskonverzió engedélyezése
      },
    })
  );
  await app.listen(3001);
}
bootstrap();
