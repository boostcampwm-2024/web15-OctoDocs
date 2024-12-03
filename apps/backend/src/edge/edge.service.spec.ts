import { Test, TestingModule } from '@nestjs/testing';
import { EdgeService } from './edge.service';
import { EdgeRepository } from './edge.repository';
import { NodeRepository } from '../node/node.repository';
import { CreateEdgeDto } from './dtos/createEdge.dto';
import { Edge } from './edge.entity';
import { Node } from '../node/node.entity';
import { EdgeNotFoundException } from '../exception/edge.exception';
import { Workspace } from '../workspace/workspace.entity';
import { WorkspaceRepository } from '../workspace/workspace.repository';
import { WorkspaceNotFoundException } from '../exception/workspace.exception';

describe('EdgeService', () => {
  let service: EdgeService;
  let edgeRepository: jest.Mocked<EdgeRepository>;
  let nodeRepository: jest.Mocked<NodeRepository>;
  let workspaceRepository: WorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EdgeService,
        {
          provide: EdgeRepository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            findOneBy: jest.fn(),
            findEdgesByWorkspace: jest.fn(),
          },
        },
        {
          provide: NodeRepository,
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

    service = module.get<EdgeService>(EdgeService);
    edgeRepository = module.get(EdgeRepository);
    nodeRepository = module.get(NodeRepository);
    workspaceRepository = module.get<WorkspaceRepository>(WorkspaceRepository);
  });

  it('서비스 클래스가 정상적으로 인스턴스화된다.', () => {
    expect(service).toBeDefined();
  });

  describe('createEdge', () => {
    it('새로운 엣지를 만들어 노드와 노드를 연결하는 연결한다.', async () => {
      const dto: CreateEdgeDto = { fromNode: 3, toNode: 5 };
      const fromNode = {
        id: 3,
        x: 0,
        y: 0,
        color: '#FFFFFF',
        title: 'Node Title',
        page: null,
        outgoingEdges: [],
        incomingEdges: [],
        workspace: null,
      } as Node;
      const toNode = {
        id: 5,
        x: 0,
        y: 0,
        color: '#FFFFFF',
        title: 'Node Title',
        page: null,
        outgoingEdges: [],
        incomingEdges: [],
        workspace: null,
      } as Node;
      const edge = {
        id: 1,
        fromNode: fromNode,
        toNode: toNode,
      } as Edge;

      jest
        .spyOn(nodeRepository, 'findOneBy')
        .mockResolvedValueOnce(fromNode) // 첫 번째 호출: fromNode
        .mockResolvedValueOnce(toNode); // 두 번째 호출: toNode
      jest.spyOn(edgeRepository, 'save').mockResolvedValue(edge);

      const result = await service.createEdge(dto);

      expect(result).toEqual(edge);
      expect(edgeRepository.save).toHaveBeenCalledTimes(1);
      expect(nodeRepository.findOneBy).toHaveBeenCalledTimes(2);
    });
  });

  describe('deleteEdge', () => {
    it('엣지를 성공적으로 삭제한다.', async () => {
      jest
        .spyOn(edgeRepository, 'delete')
        .mockResolvedValue({ affected: true } as any);
      jest.spyOn(edgeRepository, 'findOneBy').mockResolvedValue(new Edge());

      await service.deleteEdge(1);

      expect(edgeRepository.delete).toHaveBeenCalledWith(1);
    });

    it('삭제할 엣지가 존재하지 않으면 EdgeNotFoundException을 throw한다.', async () => {
      jest
        .spyOn(edgeRepository, 'delete')
        .mockResolvedValue({ affected: false } as any);
      await expect(service.deleteEdge(1)).rejects.toThrow(
        EdgeNotFoundException,
      );
    });
  });

  describe('findEdgesByWorkspace', () => {
    it('특정 워크스페이스에 존재하는 모든 엣지를 반환한다.', async () => {
      const workspaceId = '123456789012345678'; // Snowflake ID
      const workspace = {
        id: 1,
        snowflakeId: workspaceId,
        owner: null,
        title: 'Test Workspace',
        description: null,
        visibility: 'private',
        createdAt: new Date(),
        updatedAt: new Date(),
        thumbnailUrl: null,
        edges: [],
        pages: [],
        nodes: [],
      } as Workspace;
      const node3 = {
        id: 3,
        x: 0,
        y: 0,
        color: '#FFFFFF',
        title: 'Node Title',
        page: null,
        outgoingEdges: [],
        incomingEdges: [],
        workspace,
      } as Node;
      const node4 = {
        id: 4,
        x: 0,
        y: 0,
        color: '#FFFFFF',
        title: 'Node Title',
        page: null,
        outgoingEdges: [],
        incomingEdges: [],
        workspace,
      } as Node;
      const node5 = {
        id: 5,
        x: 0,
        y: 0,
        color: '#FFFFFF',
        title: 'Node Title',
        page: null,
        outgoingEdges: [],
        incomingEdges: [],
        workspace,
      } as Node;
      const node7 = {
        id: 7,
        x: 0,
        y: 0,
        color: '#FFFFFF',
        title: 'Node Title',
        page: null,
        outgoingEdges: [],
        incomingEdges: [],
        workspace,
      } as Node;

      const expectedEdgeList = [
        {
          id: 1,
          fromNode: node3,
          toNode: node5,
          workspace,
        } as Edge,
        {
          id: 2,
          fromNode: node3,
          toNode: node4,
          workspace,
        } as Edge,
        {
          id: 3,
          fromNode: node3,
          toNode: node7,
          workspace,
        } as Edge,
      ];

      jest.spyOn(workspaceRepository, 'findOneBy').mockResolvedValue(workspace);
      jest
        .spyOn(edgeRepository, 'findEdgesByWorkspace')
        .mockResolvedValue(expectedEdgeList);

      const result = await service.findEdgesByWorkspace(workspaceId);

      expect(result).toEqual(expectedEdgeList);
      expect(workspaceRepository.findOneBy).toHaveBeenCalledWith({
        snowflakeId: workspaceId,
      });
      expect(edgeRepository.findEdgesByWorkspace).toHaveBeenCalledWith(
        workspace.id,
      );
    });
  });

  it('워크스페이스가 존재하지 않을 경우, WorkspaceNotFoundException을 던진다.', async () => {
    const workspaceId = '123456789012345678';

    jest.spyOn(workspaceRepository, 'findOneBy').mockResolvedValue(null);

    await expect(service.findEdgesByWorkspace(workspaceId)).rejects.toThrow(
      WorkspaceNotFoundException,
    );

    expect(workspaceRepository.findOneBy).toHaveBeenCalledWith({
      snowflakeId: workspaceId,
    });
    expect(edgeRepository.findEdgesByWorkspace).not.toHaveBeenCalled();
  });

  it('워크스페이스에 엣지가 없을 경우, 빈 배열을 반환한다.', async () => {
    const workspaceId = '123456789012345678';
    const workspace = {
      id: 1,
      snowflakeId: workspaceId,
    };

    jest
      .spyOn(workspaceRepository, 'findOneBy')
      .mockResolvedValue(workspace as Workspace);

    jest.spyOn(edgeRepository, 'findEdgesByWorkspace').mockResolvedValue([]);

    const result = await service.findEdgesByWorkspace(workspaceId);

    expect(result).toEqual([]);
    expect(workspaceRepository.findOneBy).toHaveBeenCalledWith({
      snowflakeId: workspaceId,
    });
    expect(edgeRepository.findEdgesByWorkspace).toHaveBeenCalledWith(
      workspace.id,
    );
  });
});
