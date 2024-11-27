import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { WorkspaceRepository } from './workspace.repository';
import { RoleRepository } from '../role/role.repository';
import { CreateWorkspaceDto } from './dtos/createWorkspace.dto';
import { UserWorkspaceDto } from './dtos/userWorkspace.dto';
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
      userId: userId,
      role: 'owner',
    });
    // 아니면 exception 뱉기
    if (!role) {
      throw new NotWorkspaceOwnerException();
    }

    // 워크스페이스 삭제
    await this.workspaceRepository.delete(workspace.id);
  }

  async getUserWorkspaces(userId: number): Promise<UserWorkspaceDto[]> {
    // RoleRepository를 통해 사용자가 참여 중인 모든 워크스페이스 정보 조회
    const userRoles = await this.roleRepository.find({
      where: { userId },
      relations: ['workspace'], // 워크스페이스 정보를 함께 가져오기
    });

    // 각 워크스페이스와 역할 정보를 가공하여 반환
    return userRoles.map((role) => ({
      workspaceId: role.workspace.snowflakeId,
      title: role.workspace.title,
      description: role.workspace.description || null,
      thumbnailUrl: role.workspace.thumbnailUrl || null,
      role: role.role as 'owner' | 'guest',
    }));
  }
}
