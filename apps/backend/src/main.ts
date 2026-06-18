import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

// Pin the process timezone so all server-side week/day calculations (reservation quotas, opened
// weeks, period boundaries) use the club's local time regardless of where the server is hosted.
// Without this, a UTC-hosted server computes week boundaries differently from the (local-time)
// frontend, which breaks the exact-match lookup of opened weeks. Overridable via the TZ env var.
process.env.TZ = process.env.TZ || 'Europe/Budapest';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true,
  });

  //Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // DTO automatikus átalakítása
      transformOptions: {
        enableImplicitConversion: true, // Implicit típuskonverzió engedélyezése
      },
    })
  );

  //OpenAPI
  const config = new DocumentBuilder().setTitle('MMMK Web API').setVersion('1.0').addBearerAuth().build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  //CORS
  app.enableCors({
    origin: [process.env.FRONTEND_URL],
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3030);
}

bootstrap();
