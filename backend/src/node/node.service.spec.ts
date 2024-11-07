import { Test, TestingModule } from '@nestjs/testing';
import { NodeService } from './node.service';
import { NodeRepository } from './node.repository';

describe('NodeService', () => {
  let service: NodeService;
  let repository: NodeRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NodeService,
        {
          provide: NodeRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NodeService>(NodeService);
    repository = module.get<NodeRepository>(NodeRepository);
    jest
      .spyOn(repository, 'findById')
      .mockResolvedValue({ id: 1, x: 1, y: 2 } as any);
  });

  it('서비스 클래스가 정상적으로 인스턴스화된다.', () => {
    expect(service).toBeDefined();
  });

  it('노드 아이디를 받아 해당 노드의 좌표를 반환한다.', async () => {
    const coordinates = await service.getCoordinates(1);
    expect(coordinates).toEqual({ x: 1, y: 2 });
    expect(repository.findById).toHaveBeenCalledWith(1);
  });

  it('노드를 찾을 수 없으면 예외를 던진다.', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(null);
    await expect(service.getCoordinates(1)).rejects.toThrow(
      '해당 노드를 찾을 수 없습니다.',
    );
  });
});
