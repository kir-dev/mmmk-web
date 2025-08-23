import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  app.enableCors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:3000', RegExp('([a-zA-Z0-9-]+)*kir-dev.vercel.app/')],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true,
  });
  await app.listen(3030);
}

bootstrap();
