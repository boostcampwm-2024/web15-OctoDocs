import { Test, TestingModule } from '@nestjs/testing';
import { EdgeController } from './edge.controller';
import { EdgeService } from './edge.service';

describe('EdgeController', () => {
  let controller: EdgeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EdgeController],
      providers: [EdgeService],
    }).compile();

    controller = module.get<EdgeController>(EdgeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
