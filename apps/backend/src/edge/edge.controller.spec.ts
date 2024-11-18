import { Test, TestingModule } from '@nestjs/testing';
import { EdgeController } from './edge.controller';
import { EdgeService } from './edge.service';

describe('EdgeController', () => {
  let controller: EdgeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EdgeController],
      providers: [
        {
          provide: EdgeService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<EdgeController>(EdgeController);
  });

  it('컨트롤러 클래스가 정상적으로 인스턴스화된다.', () => {
    expect(controller).toBeDefined();
  });
});
