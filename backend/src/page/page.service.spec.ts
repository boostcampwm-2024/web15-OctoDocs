import { Test, TestingModule } from '@nestjs/testing';
import { PageService } from './page.service';
import { PageRepository } from './page.repository';

describe('PageService', () => {
  let service: PageService;
  let repository: PageRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PageService,
        {
          provide: PageRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PageService>(PageService);
    repository = module.get<PageRepository>(PageRepository);
  });

  it('서비스 클래스가 정상적으로 인스턴스화된다.', () => {
    expect(service).toBeDefined();
  });

  it('모든 페이지 목록을 조회할 수 있다.', async () => {
    jest.spyOn(repository, 'findAll').mockResolvedValue([]);
    const result = await service.getPages();
    expect(result).toEqual([]);
  });
});
