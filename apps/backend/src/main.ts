import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';

import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new IoAdapter(app));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  app.use(express.urlencoded({ extended: true }));

  // Swagger 설정 (production 환경에서는 비활성화)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('OctoDocs')
      .setDescription('OctoDocs API 명세서')
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://octodocs.site', 'https://www.octodocs.site']
        : process.env.origin,
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
