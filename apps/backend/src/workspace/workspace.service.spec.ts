import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceService } from './workspace.service';
import { WorkspaceRepository } from './workspace.repository';
import { UserRepository } from '../user/user.repository';
import { RoleRepository } from '../role/role.repository';
import { UserNotFoundException } from '../exception/user.exception';
import { WorkspaceNotFoundException } from '../exception/workspace.exception';
import { NotWorkspaceOwnerException } from '../exception/workspace-auth.exception';
import { CreateWorkspaceDto } from './dtos/createWorkspace.dto';
import { Workspace } from './workspace.entity';
import { Role } from '../role/role.entity';
import { User } from '../user/user.entity';

describe('WorkspaceService', () => {
  let service: WorkspaceService;
  let workspaceRepository: WorkspaceRepository;
  let userRepository: UserRepository;
  let roleRepository: RoleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceService,
        {
          provide: WorkspaceRepository,
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: RoleRepository,
          useValue: {
            findOneBy: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WorkspaceService>(WorkspaceService);
    workspaceRepository = module.get<WorkspaceRepository>(WorkspaceRepository);
    userRepository = module.get<UserRepository>(UserRepository);
    roleRepository = module.get<RoleRepository>(RoleRepository);
  });

  it('서비스 클래스가 정상적으로 인스턴스화된다.', () => {
    expect(service).toBeDefined();
    expect(workspaceRepository).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('createWorkspace', () => {
    it('워크스페이스를 성공적으로 생성한다.', async () => {
      const userId = 1;
      const dto: CreateWorkspaceDto = {
        title: 'New Workspace',
        description: 'A test workspace',
        visibility: 'private',
        thumbnailUrl: 'http://example.com/thumbnail.png',
      };

      const owner = { id: userId } as User;
      const newDate = new Date();
      const newWorkspace: Workspace = {
        id: 1,
        snowflakeId: 'snowflake-id',
        owner,
        title: dto.title,
        description: dto.description,
        visibility: dto.visibility,
        createdAt: newDate,
        updatedAt: newDate,
        thumbnailUrl: dto.thumbnailUrl,
        edges: [],
        pages: [],
        nodes: [],
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(owner);
      jest.spyOn(workspaceRepository, 'save').mockResolvedValue(newWorkspace);

      const result = await service.createWorkspace(userId, dto);

      expect(result).toEqual(newWorkspace);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(workspaceRepository.save).toHaveBeenCalledWith({
        owner,
        ...dto,
        visibility: 'private',
      });
      expect(roleRepository.save).toHaveBeenCalledWith({
        userId: owner.id,
        workspaceId: newWorkspace.id,
        role: 'owner',
      });
    });

    it('사용자가 존재하지 않으면 UserNotFoundException을 throw한다.', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      const dto: CreateWorkspaceDto = {
        title: 'New Workspace',
        description: 'A test workspace',
        visibility: 'private',
        thumbnailUrl: 'http://example.com/thumbnail.png',
      };

      await expect(service.createWorkspace(1, dto)).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });

  describe('deleteWorkspace', () => {
    it('id에 해당하는 워크스페이스를 찾아 성공적으로 삭제한다.', async () => {
      const userId = 1;
      const workspaceId = 'snowflake-id';
      const newDate = new Date();

      const workspace: Workspace = {
        id: 1,
        snowflakeId: workspaceId,
        owner: { id: userId } as User,
        title: 'Test Workspace',
        description: null,
        visibility: 'private',
        createdAt: newDate,
        updatedAt: newDate,
        thumbnailUrl: null,
        edges: [],
        pages: [],
        nodes: [],
      };

      const role: Role = {
        workspaceId: workspace.id,
        userId,
        workspace,
        user: null,
        role: 'owner',
        createdAt: new Date(),
      };

      jest.spyOn(workspaceRepository, 'findOneBy').mockResolvedValue(workspace);
      jest.spyOn(roleRepository, 'findOneBy').mockResolvedValue(role);
      jest.spyOn(workspaceRepository, 'delete').mockResolvedValue({} as any);

      await service.deleteWorkspace(userId, workspaceId);

      expect(workspaceRepository.findOneBy).toHaveBeenCalledWith({
        snowflakeId: workspaceId,
      });
      expect(roleRepository.findOneBy).toHaveBeenCalledWith({
        workspaceId: workspace.id,
        userId,
        role: 'owner',
      });
      expect(workspaceRepository.delete).toHaveBeenCalledWith(workspace.id);
    });

    it('id에 해당하는 워크스페이스가 없을 경우 WorkspaceNotFoundException을 throw한다.', async () => {
      jest.spyOn(workspaceRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.deleteWorkspace(1, 'snowflake-id')).rejects.toThrow(
        WorkspaceNotFoundException,
      );
    });

    it('현재 요청하는 사용자가 워크스페이스의 owner이 아닐 경우  NotWorkspaceOwnerException을 throw한다.', async () => {
      const workspace: Workspace = {
        id: 1,
        snowflakeId: 'snowflake-id',
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
      };

      jest.spyOn(workspaceRepository, 'findOneBy').mockResolvedValue(workspace);
      jest.spyOn(roleRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.deleteWorkspace(1, 'snowflake-id')).rejects.toThrow(
        NotWorkspaceOwnerException,
      );
    });
  });

  describe('getUserWorkspaces', () => {
    it('현재 요청하는 사용자가 참여하고 있는 워크스페이스들을 반환한다.', async () => {
      const userId = 1;
      const workspace: Workspace = {
        id: 1,
        snowflakeId: 'snowflake-id',
        owner: null,
        title: 'Workspace Title',
        description: 'Workspace Description',
        visibility: 'private',
        createdAt: new Date(),
        updatedAt: new Date(),
        thumbnailUrl: 'http://example.com/thumbnail.png',
        edges: [],
        pages: [],
        nodes: [],
      };

      const role: Role = {
        workspaceId: workspace.id,
        userId,
        workspace,
        user: null,
        role: 'owner',
        createdAt: new Date(),
      };

      jest.spyOn(roleRepository, 'find').mockResolvedValue([role]);

      const result = await service.getUserWorkspaces(userId);

      expect(result).toEqual([
        {
          workspaceId: 'snowflake-id',
          title: 'Workspace Title',
          description: 'Workspace Description',
          thumbnailUrl: 'http://example.com/thumbnail.png',
          role: 'owner',
        },
      ]);
      expect(roleRepository.find).toHaveBeenCalledWith({
        where: { userId },
        relations: ['workspace'],
      });
    });
  });
});
