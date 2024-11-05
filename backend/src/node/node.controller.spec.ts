import { Test, TestingModule } from '@nestjs/testing';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';

describe('NodeController', () => {
  let controller: NodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NodeController],
      providers: [NodeService],
    }).compile();

    controller = module.get<NodeController>(NodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
