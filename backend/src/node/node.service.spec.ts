import { Test, TestingModule } from '@nestjs/testing';
import { NodeService } from './node.service';

describe('NodeService', () => {
  let service: NodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NodeService],
    }).compile();

    service = module.get<NodeService>(NodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
