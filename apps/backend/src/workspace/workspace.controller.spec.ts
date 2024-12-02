import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWorkspaceDto } from './dtos/createWorkspace.dto';
import { WorkspaceResponseMessage } from './workspace.controller';
import { NotWorkspaceOwnerException } from '../exception/workspace-auth.exception';
import { UserWorkspaceDto } from './dtos/userWorkspace.dto';
import { TokenService } from '../auth/token/token.service';
import { WorkspaceNotFoundException } from '../exception/workspace.exception';
import { ForbiddenAccessException } from '../exception/access.exception';

describe('WorkspaceController', () => {
  let controller: WorkspaceController;
  let service: WorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspaceController],
      providers: [
        {
          provide: WorkspaceService,
          useValue: {
            createWorkspace: jest.fn(),
            deleteWorkspace: jest.fn(),
            getUserWorkspaces: jest.fn(),
            generateInviteUrl: jest.fn(),
            processInviteUrl: jest.fn(),
            getWorkspaceData: jest.fn(),
            updateVisibility: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true), // JwtAuthGuard를 무조건 통과하게 설정
      })
      .compile();

    controller = module.get<WorkspaceController>(WorkspaceController);
    service = module.get<WorkspaceService>(WorkspaceService);
  });

  it('컨트롤러 클래스가 정상적으로 인스턴스화된다.', () => {
    expect(controller).toBeDefined();
  });

  describe('createWorkspace', () => {
    it('워크스페이스가 성공적으로 생성된다.', async () => {
      const req = { user: { sub: 1 } };
      const dto: CreateWorkspaceDto = {
        title: 'New Workspace',
        description: 'Description',
        visibility: 'private',
        thumbnailUrl: 'http://example.com/image.png',
      };
      const mockWorkspace = { snowflakeId: 'snowflake-id-1' };

      jest
        .spyOn(service, 'createWorkspace')
        .mockResolvedValue(mockWorkspace as any);

      const result = await controller.createWorkspace(req, dto);

      expect(service.createWorkspace).toHaveBeenCalledWith(req.user.sub, dto);
      expect(result).toEqual({
        message: WorkspaceResponseMessage.WORKSPACE_CREATED,
        workspaceId: mockWorkspace.snowflakeId,
      });
    });
  });

  describe('deleteWorkspace', () => {
    it('워크스페이스를 성공적으로 삭제한다.', async () => {
      const req = { user: { sub: 1 } };
      const workspaceId = 'snowflake-id-1';

      jest.spyOn(service, 'deleteWorkspace').mockResolvedValue();

      const result = await controller.deleteWorkspace(req, workspaceId);

      expect(service.deleteWorkspace).toHaveBeenCalledWith(
        req.user.sub,
        workspaceId,
      );
      expect(result).toEqual({
        message: WorkspaceResponseMessage.WORKSPACE_DELETED,
      });
    });

    it('워크스페이스 삭제 권한이 없을 경우 예외를 던진다.', async () => {
      const req = { user: { sub: 1 } };
      const workspaceId = 'snowflake-id-1';

      jest
        .spyOn(service, 'deleteWorkspace')
        .mockRejectedValue(new NotWorkspaceOwnerException());

      await expect(
        controller.deleteWorkspace(req, workspaceId),
      ).rejects.toThrow(NotWorkspaceOwnerException);
    });
  });

  describe('getUserWorkspaces', () => {
    it('사용자가 참여 중인 워크스페이스 목록을 반환한다.', async () => {
      const req = { user: { sub: 1 } };
      const mockWorkspaces = [
        {
          workspaceId: 'snowflake-id-1',
          title: 'Workspace 1',
          description: 'Description 1',
          thumbnailUrl: 'http://example.com/image1.png',
          role: 'owner',
          visibility: 'private',
        },
        {
          workspaceId: 'snowflake-id-2',
          title: 'Workspace 2',
          description: null,
          thumbnailUrl: null,
          role: 'guest',
          visibility: 'private',
        },
      ] as UserWorkspaceDto[];

      const expectedResult = {
        message: WorkspaceResponseMessage.WORKSPACES_RETURNED,
        workspaces: mockWorkspaces,
      };

      jest
        .spyOn(service, 'getUserWorkspaces')
        .mockResolvedValue(mockWorkspaces);

      const result = await controller.getUserWorkspaces(req);

      expect(service.getUserWorkspaces).toHaveBeenCalledWith(req.user.sub);
      expect(result).toEqual(expectedResult);
    });
  });

  it('컨트롤러가 정상적으로 인스턴스화된다.', () => {
    expect(controller).toBeDefined();
  });

  describe('generateInviteLink', () => {
    it('초대 링크를 생성하고 반환한다.', async () => {
      const req = { user: { sub: 1 } };
      const workspaceId = 'workspace-snowflake-id';
      const mockInviteUrl =
        'https://example.com/api/workspace/join?token=abc123';

      jest.spyOn(service, 'generateInviteUrl').mockResolvedValue(mockInviteUrl);

      const result = await controller.generateInviteLink(req, workspaceId);

      expect(service.generateInviteUrl).toHaveBeenCalledWith(
        req.user.sub,
        workspaceId,
      );
      expect(result).toEqual({
        message: WorkspaceResponseMessage.WORKSPACE_INVITED,
        inviteUrl: mockInviteUrl,
      });
    });
  });

  describe('joinWorkspace', () => {
    it('초대 토큰을 처리하고 성공 메시지를 반환한다.', async () => {
      const req = { user: { sub: 1 } };
      const token = 'valid-token';

      jest.spyOn(service, 'processInviteUrl').mockResolvedValue();

      const result = await controller.joinWorkspace(req, token);

      expect(service.processInviteUrl).toHaveBeenCalledWith(
        req.user.sub,
        token,
      );
      expect(result).toEqual({
        message: WorkspaceResponseMessage.WORKSPACE_INVITED,
      });
    });
  });

  describe('getWorkspace', () => {
    it('워크스페이스에 접근 가능한 경우 워크스페이스 정보를 반환한다.', async () => {
      const workspaceId = 'workspace-snowflake-id';
      const userId = 'user-snowflake-id';

      const mockWorkspace = {
        workspaceId: 'snowflake-id-1',
        title: 'Workspace 1',
        description: 'Description 1',
        thumbnailUrl: 'http://example.com/image1.png',
        role: 'owner',
        visibility: 'public',
      } as UserWorkspaceDto;

      jest.spyOn(service, 'getWorkspaceData').mockResolvedValue(mockWorkspace);

      const result = await controller.getWorkspace(workspaceId, userId);

      expect(service.getWorkspaceData).toHaveBeenCalledWith(
        userId,
        workspaceId,
      );
      expect(result).toEqual({
        message: WorkspaceResponseMessage.WORKSPACE_DATA_RETURNED,
        workspace: mockWorkspace,
      });
    });

    it('로그인하지 않은 사용자의 경우 null로 처리하고 접근 가능한 경우 메시지를 반환한다.', async () => {
      const workspaceId = 'workspace-snowflake-id';
      const userId = 'null'; // 로그인되지 않은 상태를 나타냄

      jest.spyOn(service, 'getWorkspaceData').mockResolvedValue(undefined);

      const result = await controller.getWorkspace(workspaceId, userId);

      expect(service.getWorkspaceData).toHaveBeenCalledWith(null, workspaceId);
      expect(result).toEqual({
        message: WorkspaceResponseMessage.WORKSPACE_DATA_RETURNED,
      });
    });

    it('권한이 없는 경우 ForbiddenAccessException을 던진다.', async () => {
      const workspaceId = 'workspace-snowflake-id';
      const userId = 'user-snowflake-id';

      // 권한 없음
      jest
        .spyOn(service, 'getWorkspaceData')
        .mockRejectedValue(new ForbiddenAccessException());

      await expect(
        controller.getWorkspace(workspaceId, userId),
      ).rejects.toThrow(ForbiddenAccessException);

      expect(service.getWorkspaceData).toHaveBeenCalledWith(
        userId,
        workspaceId,
      );
    });

    it('워크스페이스가 존재하지 않는 경우 WorkspaceNotFoundException을 던진다.', async () => {
      const workspaceId = 'invalid-snowflake-id';
      const userId = 'user-snowflake-id';

      // 워크스페이스 없음
      jest
        .spyOn(service, 'getWorkspaceData')
        .mockRejectedValue(new WorkspaceNotFoundException());

      await expect(
        controller.getWorkspace(workspaceId, userId),
      ).rejects.toThrow(WorkspaceNotFoundException);

      expect(service.getWorkspaceData).toHaveBeenCalledWith(
        userId,
        workspaceId,
      );
    });
  });
});
