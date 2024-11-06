import { Test, TestingModule } from '@nestjs/testing';
import { PageService } from './page.service';
import { PageRepository } from './page.repository';
import { NodeService } from '../node/node.service';
import { Page } from './page.entity';
import { CreatePageDto, UpdatePageDto } from './page.dto';
import { NotFoundException } from '@nestjs/common';

describe('PageService', () => {
  let service: PageService;
  let pageRepository: PageRepository;
  let nodeService: NodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PageService,
        {
          provide: PageRepository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: NodeService,
          useValue: {
            createLinkedNode: jest.fn(),
            findNodeById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PageService>(PageService);
    pageRepository = module.get<PageRepository>(PageRepository);
    nodeService = module.get<NodeService>(NodeService);
  });

  describe('createPage', () => {
    it('should create a page and a linked node', async () => {
      const dto: CreatePageDto = {
        title: 'Test Page',
        content: null,
        x: 0,
        y: 0,
      };
      const page: Page = {
        id: 1,
        title: 'Test Page',
        content: null,
        node: null,
      };
      const node = {
        id: 1,
        x: 0,
        y: 0,
        title: 'Node Title',
        page: null,
        outgoingEdges: [],
        incomingEdges: [],
      };

      jest.spyOn(pageRepository, 'create').mockReturnValue(page);
      jest.spyOn(pageRepository, 'save').mockResolvedValue(page);
      jest.spyOn(nodeService, 'createLinkedNode').mockResolvedValue(node);

      const result = await service.createPage(dto);
      expect(result).toEqual(page);
      expect(pageRepository.create).toHaveBeenCalledWith({
        title: dto.title,
        content: dto.content,
      });
      expect(pageRepository.save).toHaveBeenCalledTimes(2); // Once for page, once for updating node
      expect(nodeService.createLinkedNode).toHaveBeenCalledWith(
        dto.x,
        dto.y,
        dto.title,
        page.id,
      );
    });
  });

  describe('deletePage', () => {
    it('should delete a page if it exists', async () => {
      jest
        .spyOn(pageRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await expect(service.deletePage(1)).resolves.not.toThrow();
      expect(pageRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if the page does not exist', async () => {
      jest
        .spyOn(pageRepository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(service.deletePage(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePage', () => {
    it('should update a page if it exists', async () => {
      const page: Page = {
        id: 1,
        title: 'Old Title',
        content: null,
        node: null,
      };
      const dto: UpdatePageDto = { title: 'New Title', content: null };
      jest.spyOn(service, 'findPageById').mockResolvedValue(page);
      jest.spyOn(pageRepository, 'save').mockResolvedValue({ ...page, ...dto });

      const result = await service.updatePage(1, dto);
      expect(result).toEqual({ ...page, ...dto });
      expect(pageRepository.save).toHaveBeenCalledWith({ ...page, ...dto });
    });

    it('should throw a NotFoundException if the page does not exist', async () => {
      jest
        .spyOn(service, 'findPageById')
        .mockRejectedValue(new NotFoundException());

      await expect(
        service.updatePage(999, null as UpdatePageDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
