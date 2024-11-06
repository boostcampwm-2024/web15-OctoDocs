import { Test, TestingModule } from '@nestjs/testing';
import { NodeService } from './node.service';
import { Page } from '../page/page.entity';
import { NodeRepository } from './node.repository';
import { PageService } from '../page/page.service';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Node } from './node.entity';
import { CreateNodeDto, UpdateNodeDto } from './node.dto';

describe('NodeService', () => {
  let service: NodeService;
  let nodeRepository: jest.Mocked<NodeRepository>;
  let pageService: jest.Mocked<PageService>;

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
          },
        },
        {
          provide: PageService,
          useValue: {
            createLinkedPage: jest.fn(),
            findPageById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NodeService>(NodeService);
    nodeRepository = module.get(NodeRepository);
    pageService = module.get(PageService);
  });

  describe('createNode', () => {
    it('should create a new node and link it to a page', async () => {
      const dto: CreateNodeDto = { title: 'Node Title', x: 0, y: 0 };
      const node = {
        id: 1,
        x: 0,
        y: 0,
        title: 'Node Title',
        page: null,
        outgoingEdges: [],
        incomingEdges: [],
      };
      const page: Page = {
        id: 1,
        title: 'Test Page',
        content: null,
        node: null,
      };

      jest.spyOn(nodeRepository, 'create').mockReturnValue(node);
      jest.spyOn(nodeRepository, 'save').mockResolvedValue(node);
      jest.spyOn(pageService, 'createLinkedPage').mockResolvedValue(page);

      const result = await service.createNode(dto);

      expect(result).toEqual(node);
      expect(nodeRepository.create).toHaveBeenCalledWith({
        x: dto.x,
        y: dto.y,
      });
      expect(nodeRepository.save).toHaveBeenCalledTimes(2);
      expect(pageService.createLinkedPage).toHaveBeenCalledWith(
        dto.title,
        node.id,
      );
    });

    it('should throw InternalServerErrorException on failure', async () => {
      const dto: CreateNodeDto = { title: 'Node Title', x: 0, y: 0 };
      nodeRepository.save.mockRejectedValue(new Error());

      await expect(service.createNode(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteNode', () => {
    it('should delete the node successfully', async () => {
      nodeRepository.delete.mockResolvedValue({ affected: 1 } as any);
      nodeRepository.findOneBy.mockResolvedValue(new Node());

      await service.deleteNode(1);

      expect(nodeRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if node is not found', async () => {
      nodeRepository.findOneBy.mockResolvedValue(undefined);

      await expect(service.deleteNode(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on failure', async () => {
      nodeRepository.findOneBy.mockResolvedValue(new Node());
      nodeRepository.delete.mockRejectedValue(new Error());

      await expect(service.deleteNode(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updateNode', () => {
    it('should update the node successfully', async () => {
      const dto: UpdateNodeDto = { title: 'Updated Title', x: 1, y: 1 };
      const node = new Node();
      nodeRepository.findOneBy.mockResolvedValue(node);
      nodeRepository.save.mockResolvedValue(node);

      const result = await service.updateNode(1, dto);

      expect(result).toEqual(node);
      expect(nodeRepository.save).toHaveBeenCalledWith({ ...node, ...dto });
    });

    it('should throw NotFoundException if node is not found', async () => {
      nodeRepository.findOneBy.mockResolvedValue(undefined);

      await expect(service.updateNode(1, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on failure', async () => {
      nodeRepository.findOneBy.mockResolvedValue(new Node());
      nodeRepository.save.mockRejectedValue(new Error());

      await expect(service.updateNode(1, {} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
