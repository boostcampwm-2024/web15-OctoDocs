import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
const REDIS_CLIENT_TOKEN = 'REDIS_CLIENT';

describe('RedisService', () => {
  let service: RedisService;
  const mockRedisClient = {
    set: jest.fn(),
    get: jest.fn(),
    quit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: REDIS_CLIENT_TOKEN,
          useValue: mockRedisClient,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
