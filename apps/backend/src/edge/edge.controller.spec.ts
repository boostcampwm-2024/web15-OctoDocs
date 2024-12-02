import { Test, TestingModule } from '@nestjs/testing';
import { EdgeController } from './edge.controller';
import { EdgeService } from './edge.service';
import { CreateEdgeDto } from './dtos/createEdge.dto';
import { EdgeResponseMessage } from './edge.controller';
import { EdgeNotFoundException } from '../exception/edge.exception';
import { Edge } from './edge.entity';
import { Node } from '../node/node.entity';

describe('EdgeController', () => {
  let controller: EdgeController;
  let edgeService: EdgeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EdgeController],
      providers: [
        {
          provide: EdgeService,
          useValue: {
            createEdge: jest.fn(),
            deleteEdge: jest.fn(),
            findEdges: jest.fn(),
            findEdgesByWorkspace: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EdgeController>(EdgeController);
    edgeService = module.get<EdgeService>(EdgeService);
  });

  it('컨트롤러 클래스가 정상적으로 인스턴스화된다.', () => {
    expect(controller).toBeDefined();
  });

  describe('createEdge', () => {
    it('엣지가 성공적으로 만들어진다', async () => {
      const dto: CreateEdgeDto = { fromNode: 1, toNode: 3 };
      const expectedResponse = {
        message: EdgeResponseMessage.EDGE_CREATED,
      };

      jest.spyOn(edgeService, 'createEdge').mockResolvedValue(undefined);
      const result = await controller.createEdge(dto);

      expect(edgeService.createEdge).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('deleteEdge', () => {
    it('id에 해당하는 엣지를 찾아 삭제한다.', async () => {
      const id = 2;
      const expectedResponse = {
        message: EdgeResponseMessage.EDGE_DELETED,
      };

      const result = await controller.deleteEdge(id);

      expect(edgeService.deleteEdge).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResponse);
    });

    it('id에 해당하는 엣지가 존재하지 않으면 NodeNotFoundException을 throw한다.', async () => {
      jest
        .spyOn(edgeService, 'deleteEdge')
        .mockRejectedValue(new EdgeNotFoundException());

      await expect(controller.deleteEdge(1)).rejects.toThrow(
        EdgeNotFoundException,
      );
    });
  });

  describe('findEdgesByWorkspace', () => {
    it('특정 워크스페이스에 존재하는 엣지들을 반환한다.', async () => {
      const workspaceId = 'workspace-id';
      const node3 = {
        id: 3,
        x: 0,
        y: 0,
        title: 'Node Title',
        page: null,
        outgoingEdges: [],
        incomingEdges: [],
        workspace: null,
      } as Node;
      const node4 = {
        id: 4,
        x: 0,
        y: 0,
        title: 'Node Title',
        page: null,
        outgoingEdges: [],
        incomingEdges: [],
        workspace: null,
      } as Node;
      const node5 = {
        id: 5,
        x: 0,
        y: 0,
        title: 'Node Title',
        page: null,
        outgoingEdges: [],
        incomingEdges: [],
        workspace: null,
      } as Node;

      const expectedEdges = [
        { id: 1, fromNode: node3, toNode: node5 },
        { id: 2, fromNode: node3, toNode: node4 },
      ] as Edge[];
      node3.outgoingEdges = [];

      jest
        .spyOn(edgeService, 'findEdgesByWorkspace')
        .mockResolvedValue(expectedEdges);

      const result = await controller.findPagesByWorkspace(workspaceId);

      expect(edgeService.findEdgesByWorkspace).toHaveBeenCalledWith(
        workspaceId,
      );
      expect(result).toEqual({
        message: EdgeResponseMessage.EDGES_RETURNED,
        edges: expectedEdges,
      });
    });
  });
});
