import { Module, forwardRef } from '@nestjs/common';
import Redis from 'ioredis';
import Redlock from 'redlock';
import { RedisModule } from '../redis/redis.module';
const RED_LOCK_TOKEN = 'RED_LOCK';
const REDIS_CLIENT_TOKEN = 'REDIS_CLIENT';

@Module({
  imports: [forwardRef(() => RedisModule)],
  providers: [
    {
      provide: RED_LOCK_TOKEN,
      useFactory: (redisClient: Redis) => {
        return new Redlock([redisClient], {
          driftFactor: 0.01,
          retryCount: 10,
          retryDelay: 200,
          retryJitter: 200,
          automaticExtensionThreshold: 500,
        });
      },
      inject: [REDIS_CLIENT_TOKEN],
    },
  ],
  exports: [RED_LOCK_TOKEN],
})
export class RedLockModule {}
