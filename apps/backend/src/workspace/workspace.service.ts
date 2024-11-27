import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { WorkspaceRepository } from './workspace.repository';
import { RoleRepository } from '../role/role.repository';
import { CreateWorkspaceDto } from './dtos/createWorkspace.dto';
import { UserNotFoundException } from '../exception/user.exception';
import { Workspace } from './workspace.entity';
import { WorkspaceNotFoundException } from '../exception/workspace.exception';
import { NotWorkspaceOwnerException } from '../exception/workspace-auth.exception';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async createWorkspace(
    userId: number,
    dto: CreateWorkspaceDto,
  ): Promise<Workspace> {
    const { title, description, visibility, thumbnailUrl } = dto;

    // Owner가 존재하는지 확인
    const owner = await this.userRepository.findOneBy({ id: userId });
    if (!owner) {
      throw new UserNotFoundException();
    }

    // 워크스페이스 생성 및 저장
    const newWorkspace = await this.workspaceRepository.save({
      owner,
      title,
      description,
      visibility: visibility || 'private', // 기본값은 private
      thumbnailUrl,
    });

    // 해당 워크스페이스 owner 저장
    this.roleRepository.create({
      userId: owner.id,
      workspaceId: newWorkspace.id,
      role: 'owner',
    });

    return newWorkspace;
  }

  async deleteWorkspace(userId: number, workspaceId: string): Promise<void> {
    // Owner가 존재하는지 확인
    const owner = await this.userRepository.findOneBy({ id: userId });
    if (!owner) {
      throw new UserNotFoundException();
    }

    // 워크스페이스가 존재하는지 확인
    const workspace = await this.workspaceRepository.findOneBy({
      snowflakeId: workspaceId,
    });
    if (!workspace) {
      throw new WorkspaceNotFoundException();
    }

    // Role Repository에서 해당 workspace의 owner이 userId인지 확인
    // Role Repository에서 해당 workspace의 owner인지 확인
    const role = await this.roleRepository.findOneBy({
      workspaceId: workspace.id,
      userId: owner.id,
      role: 'owner',
    });
    // 아니면 exception 뱉기
    if (!role) {
      throw new NotWorkspaceOwnerException();
    }

    // 워크스페이스 삭제
    await this.workspaceRepository.delete(workspace.id);
  }
}
