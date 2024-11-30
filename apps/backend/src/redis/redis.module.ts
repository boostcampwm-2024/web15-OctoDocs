import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import Redis from 'ioredis';

// 의존성 주입할 때 redis client를 식별할 토큰
const REDIS_CLIENT_TOKEN = 'REDIS_CLIENT';

@Module({
  imports: [ConfigModule], // ConfigModule 추가
  providers: [
    RedisService,
    {
      provide: REDIS_CLIENT_TOKEN,
      inject: [ConfigService], // ConfigService 주입
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        });
      },
    },
  ],
  exports: [RedisService, REDIS_CLIENT_TOKEN],
})
export class RedisModule {}
