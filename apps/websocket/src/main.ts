import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://octodocs.site', 'https://www.octodocs.site']
        : process.env.origin,
    credentials: true,
  });
  await app.listen(4242);
}
bootstrap();
