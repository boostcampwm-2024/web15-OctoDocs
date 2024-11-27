import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { UserRepository } from '../user/user.repository';
import { WorkspaceRepository } from '../workspace/workspace.repository';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly userRepository: UserRepository,
  ) {}
}
