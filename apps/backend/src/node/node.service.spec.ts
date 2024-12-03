import { Test, TestingModule } from '@nestjs/testing';
import { NodeService } from './node.service';
import { NodeRepository } from './node.repository';
import { PageRepository } from '../page/page.repository';
import { NodeNotFoundException } from '../exception/node.exception';
import { Node } from './node.entity';
import { Page } from '../page/page.entity';
import { CreateNodeDto } from './dtos/createNode.dto';
import { UpdateNodeDto } from './dtos/updateNode.dto';
import { MoveNodeDto } from './dtos/moveNode.dto';
import { WorkspaceRepository } from '../workspace/workspace.repository';
import { Workspace } from '../workspace/workspace.entity';

describe('NodeService', () => {
  let service: NodeService;
  let nodeRepository: jest.Mocked<NodeRepository>;
  let pageRepository: jest.Mocked<PageRepository>;
  let workspaceRepository: jest.Mocked<WorkspaceRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NodeService,
        {
          provide: NodeRepository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            findNodesByWorkspace: jest.fn(),
          },
        },
        {
          provide: PageRepository,
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: WorkspaceRepository,
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NodeService>(NodeService);
    nodeRepository = module.get(NodeRepository);
    pageRepository = module.get(PageRepository);
    workspaceRepository = module.get(WorkspaceRepository);
  });

  it('서비스 클래스가 정상적으로 인스턴스화된다.', () => {
    expect(service).toBeDefined();
    expect(nodeRepository).toBeDefined();
    expect(pageRepository).toBeDefined();
    expect(workspaceRepository).toBeDefined();
  });

  describe('createNode', () => {
    it('새로운 노드를 만들어 새로운 페이지와 연결한다.', async () => {
      const dto: CreateNodeDto = { title: 'Node Title', x: 0, y: 0 };
      const node = {
        id: 1,
        x: 0,
        y: 0,
        color: '#FFFFFF',
        title: 'Node Title',
        page: null,
        outgoingEdges: [],
        incomingEdges: [],
        workspace: null,
      } as Node;
      const page = { id: 1, title: 'Test Page', content: null } as Page;

      jest.spyOn(nodeRepository, 'save').mockResolvedValue(node);
      jest.spyOn(pageRepository, 'save').mockResolvedValue(page);

      const result = await service.createNode(dto);

      expect(result).toEqual(node);
      expect(nodeRepository.save).toHaveBeenCalledTimes(2);
      expect(pageRepository.save).toHaveBeenCalledWith({
        title: dto.title,
        content: {},
      });
    });
  });

  describe('deleteNode', () => {
    it('노드를 성공적으로 삭제한다.', async () => {
      jest
        .spyOn(nodeRepository, 'delete')
        .mockResolvedValue({ affected: true } as any);
      jest.spyOn(nodeRepository, 'findOneBy').mockResolvedValue(new Node());

      await service.deleteNode(1);

      expect(nodeRepository.delete).toHaveBeenCalledWith(1);
    });

    it('삭제할 노드가 존재하지 않으면 NodeNotFoundException을 throw한다.', async () => {
      jest
        .spyOn(nodeRepository, 'delete')
        .mockResolvedValue({ affected: false } as any);
      await expect(service.deleteNode(1)).rejects.toThrow(
        NodeNotFoundException,
      );
    });
  });

  describe('updateNode', () => {
    it('노드를 성공적으로 업데이트한다.', async () => {
      const dto: UpdateNodeDto = { title: 'Updated Title', x: 1, y: 1 };
      const node = new Node();
      node.page = new Page();

      jest.spyOn(nodeRepository, 'findOne').mockResolvedValue(node);
      jest.spyOn(pageRepository, 'findOneBy').mockResolvedValue(node.page);
      jest.spyOn(nodeRepository, 'save').mockResolvedValue(node);

      const result = await service.updateNode(1, dto);

      expect(result).toEqual(node);
      expect(nodeRepository.save).toHaveBeenCalledWith({
        ...node,
        x: dto.x,
        y: dto.y,
      });
      expect(pageRepository.findOneBy).toHaveBeenCalledWith({
        id: node.page.id,
      });
    });

    it('업데이트할 노드가 존재하지 않으면 NodeNotFoundException을 throw한다.', async () => {
      jest.spyOn(nodeRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.updateNode(1, {} as any)).rejects.toThrow(
        NodeNotFoundException,
      );
    });
  });

  describe('getCoordinates', () => {
    it('노드 아이디를 받아 해당 노드의 좌표를 반환한다.', async () => {
      const node = { id: 1, x: 1, y: 2 } as Node;

      jest.spyOn(nodeRepository, 'findOne').mockResolvedValue(node);

      const coordinates = await service.getCoordinates(1);

      expect(coordinates).toEqual({ x: 1, y: 2 });
      expect(nodeRepository.findOne).toHaveBeenCalledWith({
        relations: ['page'],
        select: {
          id: true,
          page: {
            id: true,
            title: true,
          },
        },
        where: {
          id: 1,
        },
      });
    });

    it('노드를 찾을 수 없으면 NodeNotFoundException을 throw한다.', async () => {
      jest.spyOn(nodeRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.getCoordinates(1)).rejects.toThrow(
        NodeNotFoundException,
      );
    });
  });

  describe('findNodeById', () => {
    it('존재하는 노드를 아이디로 조회하여 반환한다.', async () => {
      const node = {
        id: 1,
        x: 0,
        y: 0,
        color: '#FFFFFF',
        title: 'Node Title',
        page: null,
        outgoingEdges: [],
        incomingEdges: [],
        workspace: null,
      } as Node;
      jest.spyOn(nodeRepository, 'findOne').mockResolvedValue(node);

      const result = await service.findNodeById(1);

      expect(result).toEqual(node);
      expect(nodeRepository.findOne).toHaveBeenCalledWith({
        relations: ['page'],
        select: {
          id: true,
          page: {
            id: true,
            title: true,
          },
        },
        where: {
          id: 1,
        },
      });
    });

    it('노드를 찾을 수 없으면 NodeNotFoundException을 던진다.', async () => {
      jest.spyOn(nodeRepository, 'findOne').mockResolvedValue(undefined);
      await expect(service.findNodeById(1)).rejects.toThrow(
        NodeNotFoundException,
      );
      expect(nodeRepository.findOne).toHaveBeenCalledWith({
        relations: ['page'],
        select: {
          id: true,
          page: {
            id: true,
            title: true,
          },
        },
        where: {
          id: 1,
        },
      });
    });
  });

  describe('moveNode', () => {
    it('노드를 성공적으로 이동시킨다.', async () => {
      const id = 1;
      const dto: MoveNodeDto = { x: 3, y: 4 };
      const node = { id: 1, x: 0, y: 0 } as Node;

      jest.spyOn(service, 'findNodeById').mockResolvedValue(node);
      jest
        .spyOn(nodeRepository, 'update')
        .mockResolvedValue({ affected: true } as any);

      await service.moveNode(id, dto);

      expect(nodeRepository.update).toHaveBeenCalledWith(id, {
        x: dto.x,
        y: dto.y,
      });
    });

    it('노드를 찾을 수 없으면 NodeNotFoundException을 던진다.', async () => {
      jest.spyOn(nodeRepository, 'update').mockRejectedValue(new Error());
      await expect(service.moveNode(1, {} as any)).rejects.toThrow(
        NodeNotFoundException,
      );
    });
  });

  describe('findNodesByWorkspace', () => {
    it('workspace에 해당하는 노드 조회 성공', async () => {
      const currentDate = new Date();
      const workspace = {
        id: 1,
        snowflakeId: '1234567890',
        title: 'workspace',
        description: 'workspace description',
        visibility: 'private',
        createdAt: currentDate,
        updatedAt: currentDate,
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
      } as Workspace;

      jest.spyOn(workspaceRepository, 'findOneBy').mockResolvedValue(workspace);
      await service.findNodesByWorkspace(workspace.snowflakeId);

      expect(nodeRepository.findNodesByWorkspace).toHaveBeenCalledWith(
        workspace.id,
      );
    });
  });
});
