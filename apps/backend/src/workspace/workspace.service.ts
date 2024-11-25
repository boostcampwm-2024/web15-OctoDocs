import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { WorkspaceRepository } from './workspace.repository';
// import { Workspace } from './workspace.entity';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly userRepository: UserRepository,
  ) {}
}
