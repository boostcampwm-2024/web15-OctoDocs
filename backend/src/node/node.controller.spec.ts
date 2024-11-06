import { Test, TestingModule } from '@nestjs/testing';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';
import { CreateNodeDto, UpdateNodeDto } from './node.dto';
import { NotFoundException } from '@nestjs/common';

describe('NodeController', () => {
  let controller: NodeController;
  let service: jest.Mocked<NodeService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NodeController],
      providers: [
        {
          provide: NodeService,
          useValue: {
            createNode: jest.fn(),
            deleteNode: jest.fn(),
            updateNode: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<NodeController>(NodeController);
    service = module.get(NodeService);
  });

  describe('createNode', () => {
    it('should create a new node', async () => {
      const dto: CreateNodeDto = { title: 'Node Title', x: 0, y: 0 };
      const node = { id: 1, ...dto } as any;
      service.createNode.mockResolvedValue(node);

      const result = await controller.createNode(dto);

      expect(result).toEqual({
        message: 'Node and reladed Page successfully created',
        node,
      });
    });
  });

  describe('deleteNode', () => {
    it('should delete a node', async () => {
      service.deleteNode.mockResolvedValue(undefined);

      const result = await controller.deleteNode(1);

      expect(result).toEqual({
        message: 'Node with ID 1 successfully deleted',
      });
      expect(service.deleteNode).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if node is not found', async () => {
      service.deleteNode.mockRejectedValue(new NotFoundException());

      await expect(controller.deleteNode(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateNode', () => {
    it('should update a node', async () => {
      const dto: UpdateNodeDto = { title: 'Updated Title', x: 1, y: 1 };
      const node = { id: 1, ...dto } as any;
      service.updateNode.mockResolvedValue(node);

      const result = await controller.updateNode(1, dto);

      expect(result).toEqual({
        message: 'Node and related Page successfully updated',
        node,
      });
      expect(service.updateNode).toHaveBeenCalledWith(1, dto);
    });

    it('should throw NotFoundException if node is not found', async () => {
      service.updateNode.mockRejectedValue(new NotFoundException());

      await expect(controller.updateNode(1, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
