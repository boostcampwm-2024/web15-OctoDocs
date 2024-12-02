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
import { TokenService } from '../auth/token/token.service';
import { ForbiddenAccessException } from '../exception/access.exception';
import { Snowflake } from '@theinternetfolks/snowflake';
import { UserWorkspaceDto } from './dtos/userWorkspace.dto';
import { ConfigService } from '@nestjs/config';

describe('WorkspaceService', () => {
  let service: WorkspaceService;
  let workspaceRepository: WorkspaceRepository;
  let userRepository: UserRepository;
  let roleRepository: RoleRepository;
  let tokenService: TokenService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceService,
        {
          provide: WorkspaceRepository,
          useValue: {
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            save: jest.fn(),
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
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            generateInviteToken: jest.fn(),
            verifyInviteToken: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WorkspaceService>(WorkspaceService);
    workspaceRepository = module.get<WorkspaceRepository>(WorkspaceRepository);
    userRepository = module.get<UserRepository>(UserRepository);
    roleRepository = module.get<RoleRepository>(RoleRepository);
    tokenService = module.get<TokenService>(TokenService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('서비스 클래스가 정상적으로 인스턴스화된다.', () => {
    expect(service).toBeDefined();
    expect(workspaceRepository).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(roleRepository).toBeDefined();
    expect(tokenService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('createWorkspace', () => {
    it('성공적으로 워크스페이스를 생성한다.', async () => {
      // Mock 데이터
      const userId = 1;
      const dto: CreateWorkspaceDto = {
        title: 'New Workspace',
        description: 'Description of workspace',
        visibility: 'private',
        thumbnailUrl: 'http://example.com/image.png',
      };

      const mockUser = { id: userId } as User;
      const generatedSnowflakeId = Snowflake.generate();
      const mockWorkspace = {
        id: 10,
        ...dto,
        snowflakeId: generatedSnowflakeId,
      } as Workspace;

      // Mocking
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(Snowflake, 'generate').mockReturnValue(generatedSnowflakeId);
      jest.spyOn(workspaceRepository, 'save').mockResolvedValue(mockWorkspace);
      jest.spyOn(roleRepository, 'save').mockResolvedValue(undefined);

      // 실행
      const result = await service.createWorkspace(userId, dto);

      // 검증
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(workspaceRepository.save).toHaveBeenCalledWith({
        snowflakeId: generatedSnowflakeId,
        owner: mockUser,
        title: dto.title,
        description: dto.description,
        visibility: 'private', // 기본값 확인
        thumbnailUrl: dto.thumbnailUrl,
      });
      expect(roleRepository.save).toHaveBeenCalledWith({
        userId: mockUser.id,
        workspaceId: mockWorkspace.id,
        role: 'owner',
      });
      expect(result).toEqual(mockWorkspace);
    });

    it('사용자를 찾을 수 없으면 UserNotFoundException을 던진다.', async () => {
      // Mocking
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      // 실행 및 검증
      await expect(
        service.createWorkspace(1, {
          title: 'New Workspace',
          description: 'Description of workspace',
          visibility: 'private',
          thumbnailUrl: 'http://example.com/image.png',
        }),
      ).rejects.toThrow(UserNotFoundException);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(workspaceRepository.save).not.toHaveBeenCalled();
      expect(roleRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('deleteWorkspace', () => {
    it('id에 해당하는 워크스페이스를 찾아 성공적으로 삭제한다.', async () => {
      const userId = 1;
      const workspaceId = 'snowflake-id';
      const newDate = new Date();

      const workspace = {
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
      } as Workspace;

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
      const workspace = {
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
      } as Workspace;

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
      const workspace = {
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
      } as Workspace;

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
          visibility: 'private',
        },
      ]);
      expect(roleRepository.find).toHaveBeenCalledWith({
        where: { userId },
        relations: ['workspace'],
      });
    });
  });

  describe('generateInviteUrl', () => {
    it('정상적으로 초대 링크를 생성한다.', async () => {
      const userId = 1;
      const workspaceId = 'workspace-snowflake-id';
      const workspaceMock = { id: 1 } as Workspace;
      const tokenMock = 'invite-token';

      jest
        .spyOn(workspaceRepository, 'findOneBy')
        .mockResolvedValue(workspaceMock);
      jest
        .spyOn(roleRepository, 'findOneBy')
        .mockResolvedValue({ role: 'owner' } as Role);
      jest
        .spyOn(tokenService, 'generateInviteToken')
        .mockReturnValue(tokenMock);

      jest
        .spyOn(configService, 'get')
        .mockReturnValue('https://octodocs.local');

      const result = await service.generateInviteUrl(userId, workspaceId);

      expect(workspaceRepository.findOneBy).toHaveBeenCalledWith({
        snowflakeId: workspaceId,
      });
      expect(roleRepository.findOneBy).toHaveBeenCalledWith({
        userId,
        workspaceId: workspaceMock.id,
        role: 'owner',
      });
      expect(result).toEqual(
        `https://octodocs.local/api/workspace/join?token=${tokenMock}`,
      );
    });

    it('워크스페이스가 존재하지 않으면 예외를 던진다.', async () => {
      jest.spyOn(workspaceRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.generateInviteUrl(1, 'invalid-workspace-id'),
      ).rejects.toThrow(WorkspaceNotFoundException);
    });

    it('소유자가 아닌 사용자가 초대 링크를 생성하려고 하면 예외를 던진다.', async () => {
      const workspaceMock = { id: 1 } as Workspace;

      jest
        .spyOn(workspaceRepository, 'findOneBy')
        .mockResolvedValue(workspaceMock);
      jest.spyOn(roleRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.generateInviteUrl(1, 'workspace-snowflake-id'),
      ).rejects.toThrow(NotWorkspaceOwnerException);
    });
  });

  describe('processInviteUrl', () => {
    it('정상적으로 초대 링크를 처리한다.', async () => {
      const userId = 1;
      const token = 'invite-token';
      const decodedToken = { workspaceId: '1', role: 'guest' };

      jest
        .spyOn(tokenService, 'verifyInviteToken')
        .mockReturnValue(decodedToken);
      jest.spyOn(roleRepository, 'findOneBy').mockResolvedValue(null);

      await service.processInviteUrl(userId, token);

      expect(tokenService.verifyInviteToken).toHaveBeenCalledWith(token);
      expect(roleRepository.save).toHaveBeenCalledWith({
        workspaceId: 1,
        userId,
        role: 'guest',
      });
    });

    it('이미 워크스페이스에 등록된 사용자는 예외를 던진다.', async () => {
      const userId = 1;
      const token = 'invite-token';
      const decodedToken = { workspaceId: '1', role: 'guest' };

      jest
        .spyOn(tokenService, 'verifyInviteToken')
        .mockReturnValue(decodedToken);
      jest.spyOn(roleRepository, 'findOneBy').mockResolvedValue({} as Role);

      await expect(service.processInviteUrl(userId, token)).rejects.toThrow(
        Error,
      );
    });
  });

  describe('getWorkspaceData', () => {
    it('퍼블릭 워크스페이스는 권한 체크 없이 데이터를 받는다.', async () => {
      const workspace = {
        id: 1,
        snowflakeId: 'workspace-snowflake-id',
        owner: { id: 1 } as User,
        title: 'Test Workspace',
        description: null,
        visibility: 'public',
        thumbnailUrl: null,
      } as Workspace;

      const workspaceDto = {
        workspaceId: 'workspace-snowflake-id',
        title: 'Test Workspace',
        description: null,
        thumbnailUrl: null,
        role: null,
        visibility: 'public',
      } as UserWorkspaceDto;

      jest.spyOn(workspaceRepository, 'findOne').mockResolvedValue(workspace);

      const result = await service.getWorkspaceData(
        null,
        'workspace-snowflake-id',
      );

      expect(result).toEqual(workspaceDto);
    });

    it('프라이빗 워크스페이스는 권한이 없으면 예외를 던진다.', async () => {
      const workspace = {
        id: 1,
        snowflakeId: 'workspace-snowflake-id',
        owner: { id: 2 } as User,
        title: 'Test Workspace',
        description: null,
        visibility: 'private',
        thumbnailUrl: null,
      } as Workspace;

      jest.spyOn(workspaceRepository, 'findOne').mockResolvedValue(workspace);
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue({ id: 1, snowflakeId: 'user-snowflake-id' } as User);
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.getWorkspaceData('user-snowflake-id', 'workspace-snowflake-id'),
      ).rejects.toThrow(ForbiddenAccessException);
    });

    it('프라이빗 워크스페이스는 권한이 있으면 접근을 허용한다.', async () => {
      const workspace = {
        id: 1,
        snowflakeId: 'workspace-snowflake-id',
        owner: { id: 2 } as User,
        title: 'Test Workspace',
        description: null,
        visibility: 'private',
        thumbnailUrl: null,
      } as Workspace;
      const user = {
        id: 1,
        snowflakeId: 'user-snowflake-id',
      } as User;
      const role = {
        workspace: workspace,
        user: user,
        role: 'guest',
      } as Role;
      const workspaceDto = {
        workspaceId: 'workspace-snowflake-id',
        title: 'Test Workspace',
        description: null,
        thumbnailUrl: null,
        role: 'guest',
        visibility: 'private',
      } as UserWorkspaceDto;
      jest.spyOn(workspaceRepository, 'findOne').mockResolvedValue(workspace);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(role);

      const result = await service.getWorkspaceData(
        'user-snowflake-id',
        'workspace-snowflake-id',
      );

      expect(result).toEqual(workspaceDto);
    });
  });
});
