import { Test, TestingModule } from '@nestjs/testing';
import { EdgeService } from './edge.service';
import { EdgeRepository } from './edge.repository';
describe('EdgeService', () => {
  let service: EdgeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EdgeService,
        {
          provide: EdgeRepository,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<EdgeService>(EdgeService);
  });

  it('서비스 클래스가 정상적으로 인스턴스화된다.', () => {
    expect(service).toBeDefined();
  });
});
