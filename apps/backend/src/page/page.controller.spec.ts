import { Test, TestingModule } from '@nestjs/testing';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { CreatePageDto } from './dtos/createPage.dto';
import { UpdatePageDto } from './dtos/updatePage.dto';
import { PageResponseMessage } from './page.controller';
import { PageNotFoundException } from '../exception/page.exception';
import { Page } from './page.entity';
import { WorkspaceNotFoundException } from '../exception/workspace.exception';

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
            deletePage: jest.fn(),
            updatePage: jest.fn(),
            findPageById: jest.fn(),
            findPagesByWorkspace: jest.fn(),
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
    it('페이지가 성공적으로 만들어진다.', async () => {
      const dto: CreatePageDto = {
        title: 'New Page',
        content: {} as JSON,
        workspaceId: 'workspace-id',
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
        workspace: null,
      });

      const result = await controller.createPage(dto);

      expect(pageService.createPage).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResponse);
    });

    it('워크스페이스가 존재하지 않을 경우 WorkspaceNotFoundException을 throw한다.', async () => {
      const dto: CreatePageDto = {
        title: 'New Page',
        content: {} as JSON,
        workspaceId: 'invalid-workspace-id',
        x: 1,
        y: 2,
      };

      jest
        .spyOn(pageService, 'createPage')
        .mockRejectedValue(new WorkspaceNotFoundException());

      await expect(controller.createPage(dto)).rejects.toThrow(
        WorkspaceNotFoundException,
      );

      expect(pageService.createPage).toHaveBeenCalledWith(dto);
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
        workspace: null,
      };

      jest.spyOn(pageService, 'findPageById').mockResolvedValue(expectedPage);

      await expect(controller.findPage(1)).resolves.toEqual({
        message: PageResponseMessage.PAGE_RETURNED,
        page: expectedPage,
      });
    });
  });

  describe('findPagesByWorkspace', () => {
    it('특정 워크스페이스에 존재하는 페이지들을 반환한다.', async () => {
      const workspaceId = 'workspace-id';
      const expectedPages = [
        { id: 1, title: 'Page 1', emoji: '📄' },
        { id: 2, title: 'Page 2', emoji: '✏️' },
      ] as Partial<Page>[];

      jest
        .spyOn(pageService, 'findPagesByWorkspace')
        .mockResolvedValue(expectedPages);

      const result = await controller.findPagesByWorkspace(workspaceId);

      expect(pageService.findPagesByWorkspace).toHaveBeenCalledWith(
        workspaceId,
      );
      expect(result).toEqual({
        message: PageResponseMessage.PAGES_RETURNED,
        pages: expectedPages,
      });
    });

    it('워크스페이스가 존재하지 않을 경우 WorkspaceNotFoundException을 throw한다.', async () => {
      const workspaceId = 'invalid-workspace-id';

      jest
        .spyOn(pageService, 'findPagesByWorkspace')
        .mockRejectedValue(new WorkspaceNotFoundException());

      await expect(
        controller.findPagesByWorkspace(workspaceId),
      ).rejects.toThrow(WorkspaceNotFoundException);

      expect(pageService.findPagesByWorkspace).toHaveBeenCalledWith(
        workspaceId,
      );
    });
  });
});
