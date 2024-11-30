import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis';
const REDIS_CLIENT_TOKEN = 'REDIS_CLIENT';

type RedisPage = {
  title: string;
  content: string;
};
@Injectable()
export class RedisService {
  // private readonly redisClient: Redis;

  constructor(
    @Inject(REDIS_CLIENT_TOKEN) private readonly redisClient: Redis,
  ) {}

  async getAllKeys() {
    return await this.redisClient.keys('*');
  }

  async get(key: string) {
    const data = await this.redisClient.hgetall(key);
    return Object.fromEntries(
      Object.entries(data).map(([field, value]) => [field, value]),
    ) as RedisPage;
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
