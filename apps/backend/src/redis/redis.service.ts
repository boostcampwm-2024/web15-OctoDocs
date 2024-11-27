import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    });
  }

  async get(key: string) {
    return await this.redisClient.hgetall(key);
  }

  async set(key: string, value: object) {
    return await this.redisClient.hset(key, Object.entries(value));
  }

  async setField(key: string, field: string, value: string) {
    return await this.redisClient.hset(key, field, value);
  }

  async delete(key: string) {
    return await this.redisClient.del(key);
  }
}
