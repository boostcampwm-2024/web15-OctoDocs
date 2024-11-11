import { Test, TestingModule } from '@nestjs/testing';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';

describe('NodeController', () => {
  let controller: NodeController;
  let nodeService: NodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NodeController],
      providers: [
        {
          provide: NodeService,
          useValue: {
            createNode: jest.fn(),
            createLinkedNode: jest.fn(),
            deleteNode: jest.fn(),
            updateNode: jest.fn(),
            findNodeById: jest.fn(),
            getCoordinates: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<NodeController>(NodeController);
    nodeService = module.get<NodeService>(NodeService);
  });

  it('컨트롤러 클래스가 정상적으로 인스턴스화된다.', () => {
    expect(controller).toBeDefined();
  });
});
