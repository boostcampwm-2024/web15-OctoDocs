import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceService } from './workspace.service';
import { WorkspaceRepository } from './workspace.repository';
import { RoleRepository } from '../role/role.repository';
import { UserRepository } from '../user/user.repository';
import { CreateWorkspaceDto } from './dtos/createWorkspace.dto';
import { WorkspaceNotFoundException } from '../exception/workspace.exception';
import { User } from '../user/user.entity';
import { Workspace } from './workspace.entity';
import { Role } from '../role/role.entity';

describe('WorkspaceService', () => {
  let service: WorkspaceService;
  let workspaceRepository: WorkspaceRepository;
  let roleRepository: RoleRepository;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceService,
        {
          provide: WorkspaceRepository,
          useValue: {
            save: jest.fn(),
            delete: jest.fn(),
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
        {
          provide: UserRepository,
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WorkspaceService>(WorkspaceService);
    workspaceRepository = module.get<WorkspaceRepository>(WorkspaceRepository);
    roleRepository = module.get<RoleRepository>(RoleRepository);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('createWorkspace', () => {
    it('워크스페이스를 성공적으로 생성한다.', async () => {
      const user = { id: 1 } as User;
      const dto: CreateWorkspaceDto = {
        title: 'New Workspace',
        description: 'Description',
        visibility: 'private',
        thumbnailUrl: 'http://example.com/image.png',
      };

      const mockWorkspace = {
        id: 1,
        snowflakeId: 'snowflake-id-1',
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest
        .spyOn(workspaceRepository, 'save')
        .mockResolvedValue(mockWorkspace as any);

      const result = await service.createWorkspace(user.id, dto);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: user.id });
      expect(workspaceRepository.save).toHaveBeenCalledWith({
        owner: user,
        title: dto.title,
        description: dto.description,
        visibility: dto.visibility,
        thumbnailUrl: dto.thumbnailUrl,
      });
      expect(result).toEqual(mockWorkspace);
    });
  });

  describe('deleteWorkspace', () => {
    it('워크스페이스를 성공적으로 삭제한다.', async () => {
      const userId = 1;
      const workspaceId = 'snowflake-id-1';
      const mockWorkspace = { id: 1, snowflakeId: workspaceId } as Workspace;

      jest
        .spyOn(workspaceRepository, 'findOneBy')
        .mockResolvedValue(mockWorkspace);
      jest.spyOn(roleRepository, 'findOneBy').mockResolvedValue({
        workspaceId: 1,
        userId: userId,
        role: 'owner',
      } as Role);

      await service.deleteWorkspace(userId, workspaceId);

      expect(workspaceRepository.findOneBy).toHaveBeenCalledWith({
        snowflakeId: workspaceId,
      });
      expect(workspaceRepository.delete).toHaveBeenCalledWith(mockWorkspace.id);
    });

    it('워크스페이스를 찾지 못했을 경우 예외를 던진다.', async () => {
      const workspaceId = 'invalid-id';

      jest.spyOn(workspaceRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.deleteWorkspace(1, workspaceId)).rejects.toThrow(
        WorkspaceNotFoundException,
      );
    });
  });
});
