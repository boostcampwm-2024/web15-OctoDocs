import { Test, TestingModule } from '@nestjs/testing';
import { PageService } from './page.service';
import { PageRepository } from './page.repository';
import { NodeRepository } from '../node/node.repository';
import { Page } from './page.entity';
import { Node } from '../node/node.entity';
import { CreatePageDto } from './dtos/createPage.dto';
import { UpdatePageDto } from './dtos/updatePage.dto';
import { PageNotFoundException } from '../exception/page.exception';

describe('PageService', () => {
  let service: PageService;
  let pageRepository: PageRepository;
  let nodeRepository: NodeRepository;

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
            findAll: jest.fn(),
            findPageList: jest.fn(),
          },
        },
        {
          provide: NodeRepository,
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PageService>(PageService);
    pageRepository = module.get<PageRepository>(PageRepository);
    nodeRepository = module.get<NodeRepository>(NodeRepository);
  });

  it('서비스 클래스가 정상적으로 인스턴스화된다.', () => {
    expect(service).toBeDefined();
  });

  it('모든 페이지 목록을 조회할 수 있다.', async () => {});

  describe('createPage', () => {
    it('페이지를 성공적으로 생성한다.', async () => {
      // 페이지 dto
      const newPageDto: CreatePageDto = {
        title: 'new page',
        content: {} as JSON,
        x: 1,
        y: 1,
      };
      const newDate = new Date();
      // 페이지 엔티티
      const newPage: Page = {
        id: 1,
        snowflakeId: 'generated-snowflake-id-page',
        title: 'new page',
        content: {} as JSON,
        createdAt: newDate,
        updatedAt: newDate,
        version: 1,
        node: null,
        emoji: null,
      };

      // 노드 엔티티
      const newNode: Node = {
        id: 1,
        x: 0,
        y: 0,
        page: null,
        outgoingEdges: [],
        incomingEdges: [],
      };

      // 레포지토리 모킹
      jest.spyOn(pageRepository, 'save').mockResolvedValue(newPage);
      jest.spyOn(nodeRepository, 'save').mockResolvedValue(newNode);

      // 페이지 생성
      const createdPage: Page = await service.createPage(newPageDto);
      expect(createdPage).toEqual(newPage);
    });
  });
  describe('createLinkedPage', () => {
    it('', () => {});
  });

  describe('deletePage', () => {
    it('id에 해당하는 페이지를 찾아 성공적으로 삭제한다.', async () => {
      jest
        .spyOn(pageRepository, 'delete')
        .mockResolvedValue({ affected: true } as any);
      jest.spyOn(pageRepository, 'findOneBy').mockResolvedValue(new Page());

      await service.deletePage(1);

      expect(pageRepository.delete).toHaveBeenCalledWith(1);
    });

    it('id에 해당하는 페이지가 없을 경우 PageNotFoundException을 throw한다.', async () => {
      jest
        .spyOn(pageRepository, 'delete')
        .mockResolvedValue({ affected: false } as any);

      await expect(service.deletePage(1)).rejects.toThrow(
        PageNotFoundException,
      );
    });
  });

  describe('updatePage', () => {
    it('id에 해당하는 페이지를 찾아 성공적으로 갱신한다.', async () => {
      const dto: UpdatePageDto = {
        title: 'Updated Title',
        content: {} as JSON,
        emoji: '📝',
      };
      const originDate = new Date();
      const originPage: Page = {
        id: 1,
        snowflakeId: 'generated-snowflake-id-page',
        title: 'origin title',
        content: {} as JSON,
        node: null,
        createdAt: originDate,
        updatedAt: originDate,
        version: 1,
        emoji: null,
      };
      const newDate = new Date();
      const newPage: Page = {
        id: 1,
        snowflakeId: 'generated-snowflake-id-page',
        title: 'Updated Title',
        content: {} as JSON,
        node: null,
        createdAt: newDate,
        updatedAt: newDate,
        version: 1,
        emoji: '📝',
      };

      jest.spyOn(pageRepository, 'findOneBy').mockResolvedValue(originPage);
      jest.spyOn(pageRepository, 'save').mockResolvedValue(newPage);

      const result = await service.updatePage(1, dto);

      expect(result).toEqual(newPage);
      expect(pageRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
      });
      expect(pageRepository.save).toHaveBeenCalledWith(newPage);
    });

    it('id에 해당하는 페이지가 없을 경우 PageNotFoundException을 throw한다.', async () => {
      jest
        .spyOn(nodeRepository, 'findOneBy')
        .mockResolvedValue({ affected: false } as any);

      await expect(service.updatePage(1, new UpdatePageDto())).rejects.toThrow(
        PageNotFoundException,
      );
    });
  });

  describe('findPageById', () => {
    it('id에 해당하는 페이지를 찾아 성공적으로 반환한다.', async () => {
      const newDate = new Date();
      const expectedPage: Page = {
        id: 1,
        snowflakeId: 'generated-snowflake-id-page',
        title: 'title',
        content: {} as JSON,
        node: null,
        createdAt: newDate,
        updatedAt: newDate,
        version: 1,
        emoji: null,
      };
      jest.spyOn(pageRepository, 'findOneBy').mockResolvedValue(expectedPage);

      await expect(service.findPageById(1)).resolves.toEqual(expectedPage);
    });

    it('id에 해당하는 페이지가 없을 경우 PageNotFoundException을 throw한다.', async () => {
      jest.spyOn(pageRepository, 'findOneBy').mockResolvedValue(undefined);

      await expect(service.findPageById(1)).rejects.toThrow(
        PageNotFoundException,
      );

      expect(pageRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('findPages', () => {
    it('존재하는 모든 페이지를 content 없이 반환한다.', async () => {
      const expectedPageList = [
        {
          id: 1,
          snowflakeId: 'generated-snowflake-id-page-1',
          title: 'title1',
          node: null,
        },
        {
          id: 2,
          snowflakeId: 'generated-snowflake-id-page-2',
          title: 'title2',
          node: null,
        },
        {
          id: 3,
          snowflakeId: 'generated-snowflake-id-page-3',
          title: 'title3',
          node: null,
        },
      ] as Page[];

      jest
        .spyOn(pageRepository, 'findPageList')
        .mockResolvedValue(expectedPageList);
      const result = await service.findPages();
      expect(result).toEqual(expectedPageList);
    });

    it('페이지가 존재하지 않을 경우, 빈 배열을 반환한다.', async () => {
      jest.spyOn(pageRepository, 'findPageList').mockResolvedValue([]);
      const result = await service.findPages();
      expect(result).toEqual([]);
    });
  });
});
