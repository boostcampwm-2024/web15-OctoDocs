import { Test, TestingModule } from '@nestjs/testing';
import { EdgeService } from './edge.service';

describe('EdgeService', () => {
  let service: EdgeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EdgeService],
    }).compile();

    service = module.get<EdgeService>(EdgeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
