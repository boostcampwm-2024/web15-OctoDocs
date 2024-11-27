import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import { UserRepository } from '../user/user.repository';
import { WorkspaceRepository } from '../workspace/workspace.repository';

describe('RoleService', () => {
  let service: RoleService;
  let userRepository: UserRepository;
  let workspaceRepository: WorkspaceRepository;
  let roleRepository: RoleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: RoleRepository,
          useValue: {},
        },
        {
          provide: UserRepository,
          useValue: {},
        },
        {
          provide: WorkspaceRepository,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    roleRepository = module.get<RoleRepository>(RoleRepository);
    userRepository = module.get<UserRepository>(UserRepository);
    workspaceRepository = module.get<WorkspaceRepository>(WorkspaceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(roleRepository).toBeDefined();
    expect(workspaceRepository).toBeDefined();
  });
});
