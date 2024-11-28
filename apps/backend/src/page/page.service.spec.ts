import { Test, TestingModule } from '@nestjs/testing';
import { PageService } from './page.service';
import { PageRepository } from './page.repository';
import { NodeRepository } from '../node/node.repository';
import { Page } from './page.entity';
import { Node } from '../node/node.entity';
import { Workspace } from '../workspace/workspace.entity';
import { CreatePageDto } from './dtos/createPage.dto';
import { UpdatePageDto } from './dtos/updatePage.dto';
import { PageNotFoundException } from '../exception/page.exception';
import { WorkspaceRepository } from '../workspace/workspace.repository';
import { WorkspaceNotFoundException } from '../exception/workspace.exception';

describe('PageService', () => {
  let service: PageService;
  let pageRepository: PageRepository;
  let nodeRepository: NodeRepository;
  let workspaceRepository: WorkspaceRepository;

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
            findPagesByWorkspace: jest.fn(),
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

    service = module.get<PageService>(PageService);
    pageRepository = module.get<PageRepository>(PageRepository);
    nodeRepository = module.get<NodeRepository>(NodeRepository);
    workspaceRepository = module.get<WorkspaceRepository>(WorkspaceRepository);
  });

  it('서비스 클래스가 정상적으로 인스턴스화된다.', () => {
    expect(service).toBeDefined();
  });

  describe('createPage', () => {
    it('페이지를 성공적으로 생성한다.', async () => {
      const newDate1 = new Date();
      const workspace1 = {
        id: 1,
        snowflakeId: 'snowflake-id-1',
        owner: null,
        title: 'workspace1',
        description: null,
        visibility: 'private',
        createdAt: newDate1,
        updatedAt: newDate1,
        thumbnailUrl: null,
        edges: [],
        pages: [],
        nodes: [],
      } as Workspace;

      // 페이지 dto
      const newPageDto: CreatePageDto = {
        title: 'new page',
        content: {} as JSON,
        workspaceId: 'snowflake-id-1',
        x: 1,
        y: 1,
      };

      const newDate2 = new Date();
      // 페이지 엔티티
      const newPage: Page = {
        id: 1,
        title: 'new page',
        content: {} as JSON,
        createdAt: newDate2,
        updatedAt: newDate2,
        version: 1,
        node: null,
        emoji: null,
        workspace: workspace1,
      };

      // 노드 엔티티
      const newNode: Node = {
        id: 1,
        x: 0,
        y: 0,
        page: null,
        outgoingEdges: [],
        incomingEdges: [],
        workspace: workspace1,
      };

      jest
        .spyOn(workspaceRepository, 'findOneBy')
        .mockResolvedValue(workspace1);

      jest.spyOn(nodeRepository, 'save').mockResolvedValue(newNode);

      jest.spyOn(pageRepository, 'save').mockResolvedValue(newPage);

      const createdPage: Page = await service.createPage(newPageDto);

      expect(createdPage).toEqual(newPage);
      expect(workspaceRepository.findOneBy).toHaveBeenCalledWith({
        snowflakeId: 'snowflake-id-1',
      });
      expect(nodeRepository.save).toHaveBeenCalledWith({
        title: 'new page',
        x: 1,
        y: 1,
        workspace: workspace1,
      });
      expect(pageRepository.save).toHaveBeenCalledWith({
        title: 'new page',
        content: {} as JSON,
        emoji: undefined,
        workspace: workspace1,
      });
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
        title: 'origin title',
        content: {} as JSON,
        node: null,
        createdAt: originDate,
        updatedAt: originDate,
        version: 1,
        emoji: null,
        workspace: null,
      };
      const newDate = new Date();
      const newPage: Page = {
        id: 1,
        title: 'Updated Title',
        content: {} as JSON,
        node: null,
        createdAt: newDate,
        updatedAt: newDate,
        version: 1,
        emoji: '📝',
        workspace: null,
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
        title: 'title',
        content: {} as JSON,
        node: null,
        createdAt: newDate,
        updatedAt: newDate,
        version: 1,
        emoji: null,
        workspace: null,
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

  describe('findPagesByWorkspace', () => {
    it('특정 워크스페이스에 존재하는 페이지들을 content 없이 반환한다.', async () => {
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

      const page1: Page = {
        id: 1,
        title: 'Page 1',
        content: {} as JSON,
        node: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        emoji: '📄',
        workspace,
      };

      const expectedPageList = [
        { id: page1.id, title: page1.title, emoji: page1.emoji },
      ] as Partial<Page>[];

      jest.spyOn(workspaceRepository, 'findOneBy').mockResolvedValue(workspace);
      jest
        .spyOn(pageRepository, 'findPagesByWorkspace')
        .mockResolvedValue(expectedPageList);

      const result = await service.findPagesByWorkspace(workspaceId);

      expect(result).toEqual(expectedPageList);
      expect(workspaceRepository.findOneBy).toHaveBeenCalledWith({
        snowflakeId: workspaceId,
      });
      expect(pageRepository.findPagesByWorkspace).toHaveBeenCalledWith(
        workspace.id,
      );
    });

    it('워크스페이스가 존재하지 않을 경우, WorkspaceNotFoundException을 던진다.', async () => {
      const workspaceId = '123456789012345678';

      jest.spyOn(workspaceRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findPagesByWorkspace(workspaceId)).rejects.toThrow(
        WorkspaceNotFoundException,
      );

      expect(workspaceRepository.findOneBy).toHaveBeenCalledWith({
        snowflakeId: workspaceId,
      });
      expect(pageRepository.findPagesByWorkspace).not.toHaveBeenCalled();
    });

    it('워크스페이스에 페이지가 없을 경우, 빈 배열을 반환한다.', async () => {
      const workspaceId = '123456789012345678';
      const workspace = {
        id: 1,
        snowflakeId: workspaceId,
      };

      jest
        .spyOn(workspaceRepository, 'findOneBy')
        .mockResolvedValue(workspace as Workspace);

      jest.spyOn(pageRepository, 'findPagesByWorkspace').mockResolvedValue([]);

      const result = await service.findPagesByWorkspace(workspaceId);

      expect(result).toEqual([]);
      expect(workspaceRepository.findOneBy).toHaveBeenCalledWith({
        snowflakeId: workspaceId,
      });
      expect(pageRepository.findPagesByWorkspace).toHaveBeenCalledWith(
        workspace.id,
      );
    });
  });
});
