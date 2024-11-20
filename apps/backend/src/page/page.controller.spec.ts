import { Test, TestingModule } from '@nestjs/testing';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { CreatePageDto } from './dtos/createPage.dto';
import { UpdatePageDto } from './dtos/updatePage.dto';
import { PageResponseMessage } from './page.controller';
import { PageNotFoundException } from '../exception/page.exception';
import { Page } from './page.entity';

describe('PageController', () => {
  let controller: PageController;
  let pageService: PageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PageController],
      providers: [
        {
          provide: PageService,
          useValue: {
            createPage: jest.fn(),
            createLinkedPage: jest.fn(),
            deletePage: jest.fn(),
            updatePage: jest.fn(),
            findPageById: jest.fn(),
            findPages: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PageController>(PageController);
    pageService = module.get<PageService>(PageService);
  });

  it('컨트롤러 클래스가 정상적으로 인스턴스화된다.', () => {
    expect(controller).toBeDefined();
  });

  describe('createPage', () => {
    it('페이지가 성공적으로 만들어진다', async () => {
      const dto: CreatePageDto = {
        title: 'New Page',
        content: {} as JSON,
        x: 1,
        y: 2,
      };
      const expectedResponse = {
        message: PageResponseMessage.PAGE_CREATED,
        pageId: 1,
      };
      const newDate = new Date();
      jest.spyOn(pageService, 'createPage').mockResolvedValue({
        id: 1,
        title: 'New Page',
        content: {} as JSON,
        createdAt: newDate,
        updatedAt: newDate,
        version: 1,
        node: null,
        emoji: null,
      });
      const result = await controller.createPage(dto);

      expect(pageService.createPage).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('deletePage', () => {
    it('id에 해당하는 페이지를 찾아 삭제한다.', async () => {
      const id = 2;
      const expectedResponse = {
        message: PageResponseMessage.PAGE_DELETED,
      };

      const result = await controller.deletePage(id);

      expect(pageService.deletePage).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResponse);
    });

    it('id에 해당하는 페이지가 존재하지 않으면 PageNotFoundException을 throw한다.', async () => {
      jest
        .spyOn(pageService, 'deletePage')
        .mockRejectedValue(new PageNotFoundException());

      await expect(controller.deletePage(1)).rejects.toThrow(
        PageNotFoundException,
      );
    });
  });

  describe('updatePage', () => {
    it('id에 해당하는 페이지를 찾아 갱신한다.', async () => {
      const id = 2;
      const dto: UpdatePageDto = { title: 'Updated Node', content: {} as JSON };
      const expectedResponse = {
        message: PageResponseMessage.PAGE_UPDATED,
      };

      const result = await controller.updatePage(id, dto);

      expect(pageService.updatePage).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(expectedResponse);
    });

    it('id에 해당하는 페이지가 존재하지 않으면 PageNotFoundException을 throw한다.', async () => {
      jest
        .spyOn(pageService, 'updatePage')
        .mockRejectedValue(new PageNotFoundException());

      await expect(
        controller.updatePage(1, new UpdatePageDto()),
      ).rejects.toThrow(PageNotFoundException);
    });
  });

  describe('findPages', () => {
    it('모든 페이지 목록을 content 없이 반환한다.', async () => {
      const expectedPages = [
        { id: 1, title: 'Page1' },
        { id: 2, title: 'Page2' },
      ] as Page[];

      jest.spyOn(pageService, 'findPages').mockResolvedValue(expectedPages);

      await expect(controller.findPages()).resolves.toEqual({
        message: PageResponseMessage.PAGE_LIST_RETURNED,
        pages: expectedPages,
      });
    });
  });

  describe('findPageById', () => {
    it('id에 해당하는 페이지의 상세 정보를 반환한다.', async () => {
      const expectedPage: Page = {
        id: 1,
        title: 'title',
        content: {} as JSON,
        node: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        emoji: null,
      };

      jest.spyOn(pageService, 'findPageById').mockResolvedValue(expectedPage);

      await expect(controller.findPage(1)).resolves.toEqual({
        message: PageResponseMessage.PAGE_RETURNED,
        page: expectedPage,
      });
    });
  });
});
