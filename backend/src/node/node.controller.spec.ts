import { Test, TestingModule } from '@nestjs/testing';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';
import { NodeResponseMessage } from './node.controller';
import { CreateNodeDto } from './dtos/createNode.dto';
import { UpdateNodeDto } from './dtos/updateNode.dto';
import { NodeNotFoundException } from '../exception/node.exception';

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

  describe('createNode', () => {
    it('노드가 성공적으로 만들어진다', async () => {
      const dto: CreateNodeDto = { title: 'New Node', x: 1, y: 2 };
      const expectedResponse = {
        message: NodeResponseMessage.NODE_CREATED,
      };

      const result = await controller.createNode(dto);

      expect(nodeService.createNode).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('deleteNode', () => {
    it('id에 해당하는 노드를 찾아 삭제한다.', async () => {
      const id = 2;
      const expectedResponse = {
        message: NodeResponseMessage.NODE_DELETED,
      };

      const result = await controller.deleteNode(id);

      expect(nodeService.deleteNode).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResponse);
    });

    it('id에 해당하는 노드가 존재하지 않으면 NodeNotFoundException을 throw한다.', async () => {
      jest
        .spyOn(nodeService, 'deleteNode')
        .mockRejectedValue(new NodeNotFoundException());

      await expect(controller.deleteNode(1)).rejects.toThrow(
        NodeNotFoundException,
      );
    });
  });

  describe('updateNode', () => {
    it('id에 해당하는 노드를 찾아 갱신한다.', async () => {
      const id = 2;
      const dto: UpdateNodeDto = { title: 'Updated Node', x: 3, y: 4 };
      const expectedResponse = {
        message: NodeResponseMessage.NODE_UPDATED,
      };

      const result = await controller.updateNode(id, dto);

      expect(nodeService.updateNode).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(expectedResponse);
    });

    it('id에 해당하는 노드가 존재하지 않으면 NodeNotFoundException을 throw한다.', async () => {
      jest
        .spyOn(nodeService, 'updateNode')
        .mockRejectedValue(new NodeNotFoundException());

      await expect(
        controller.updateNode(1, new UpdateNodeDto()),
      ).rejects.toThrow(NodeNotFoundException);
    });
  });
  describe('getCoordinates', () => {
    it('id에 해당하는 노드를 찾아 좌표를 반환한다.', async () => {
      const id = 2;
      const expectedCoor = { x: 3, y: 8 };

      jest.spyOn(nodeService, 'getCoordinates').mockResolvedValue(expectedCoor);

      await expect(controller.getCoordinates(id)).resolves.toEqual({
        message: NodeResponseMessage.NODE_GET_COORDINAE,
        coordinate: expectedCoor,
      });
    });

    it('id에 해당하는 노드가 존재하지 않으면 NodeNotFoundException을 throw한다.', async () => {
      jest
        .spyOn(nodeService, 'getCoordinates')
        .mockRejectedValue(new NodeNotFoundException());

      await expect(controller.getCoordinates(1)).rejects.toThrow(
        NodeNotFoundException,
      );
    });
  });
});
