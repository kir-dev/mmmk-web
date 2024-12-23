import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
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
