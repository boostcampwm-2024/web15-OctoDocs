import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { WorkspaceRepository } from './workspace.repository';
import { RoleRepository } from '../role/role.repository';
import { CreateWorkspaceDto } from './dtos/createWorkspace.dto';
import { UserWorkspaceDto } from './dtos/userWorkspace.dto';
import { UserNotFoundException } from '../exception/user.exception';
import { Workspace } from './workspace.entity';
import { WorkspaceNotFoundException } from '../exception/workspace.exception';
import { NotWorkspaceOwnerException } from '../exception/workspace-auth.exception';
import { TokenService } from '../auth/token/token.service';
import { ForbiddenAccessException } from '../exception/access.exception';
import { UserAlreadyInWorkspaceException } from '../exception/role-duplicate.exception';
import { Snowflake } from '@theinternetfolks/snowflake';

enum MainWorkspace {
  OWNER_SNOWFLAKEID = 'admin',
  OWNER_PROVIDER_ID = 'adminProviderId',
  OWNER_PROVIDER = 'adminProvider',
  OWNER_EMAIL = 'admin@mail.com',
  WORKSPACE_SNOWFLAKEID = 'main',
  WORKSPACE_TITLE = 'main workspace',
  WORKSPACE_DESCRIPTION = '모든 유저가 접근 가능한 메인 workspace',
  WORKSPACE_VISIBILITY = 'public',
}

@Injectable()
export class WorkspaceService {
  private readonly logger = new Logger(WorkspaceService.name); // 클래스 이름을 context로 설정

  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly tokenService: TokenService,
  ) {
    console.log('환경 : ', process.env.NODE_ENV);
    if (process.env.NODE_ENV !== 'test') {
      this.initializeMainWorkspace();
    }
  }

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
      snowflakeId: Snowflake.generate(),
      owner,
      title,
      description,
      visibility: visibility || 'private', // 기본값은 private
      thumbnailUrl,
    });

    // 해당 워크스페이스 owner 저장
    this.roleRepository.save({
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
      visibility: role.workspace.visibility as 'public' | 'private',
    }));
  }

  async generateInviteUrl(
    userId: number,
    workspaceId: string,
  ): Promise<string> {
    // 워크스페이스가 존재하는지 확인
    const workspace = await this.workspaceRepository.findOneBy({
      snowflakeId: workspaceId,
    });

    if (!workspace) {
      throw new WorkspaceNotFoundException();
    }

    // Role Repository에서 해당 사용자가 소유자인지 확인
    const role = await this.roleRepository.findOneBy({
      userId,
      workspaceId: workspace.id,
      role: 'owner',
    });

    if (!role) {
      throw new NotWorkspaceOwnerException();
    }

    // 게스트용 초대용 토큰 생성
    const token = this.tokenService.generateInviteToken(workspace.id, 'guest');

    // TODO: 하드코딩 -> 바꿔야할듯?
    return `https://octodocs.local/api/workspace/join?token=${token}`;
  }

  async processInviteUrl(userId: number, token: string): Promise<void> {
    // 토큰 검증 및 디코딩
    const decodedToken = this.tokenService.verifyInviteToken(token);
    const { workspaceId, role } = decodedToken;

    // 현재 사용자를 초대받은 역할로 등록
    const existingRole = await this.roleRepository.findOneBy({
      workspaceId: parseInt(workspaceId),
      userId,
    });

    // 이미 워크스페이스에 등록된 경우
    if (existingRole) {
      throw new UserAlreadyInWorkspaceException();
    }

    // 새로운 역할 생성
    await this.roleRepository.save({
      workspaceId: parseInt(workspaceId),
      userId: userId,
      role: role,
    });
  }

  async checkAccess(userId: string | null, workspaceId: string): Promise<void> {
    // workspace가 존재하는지 확인
    const workspace = await this.workspaceRepository.findOne({
      where: { snowflakeId: workspaceId },
    });

    if (!workspace) {
      throw new WorkspaceNotFoundException();
    }

    // 퍼블릭 워크스페이스인 경우
    if (workspace.visibility === 'public') {
      return;
    }

    // 사용자 인증 필요
    if (userId !== null) {
      const user = await this.userRepository.findOneBy({
        snowflakeId: userId,
      });
      if (!user) {
        throw new UserNotFoundException();
      }

      // workspace와 user에 대한 role 확인
      const role = await this.roleRepository.findOne({
        where: { userId: user.id, workspaceId: workspace.id },
      });

      // role이 존재하면 접근 허용
      if (role) {
        return;
      }
    }

    // 권한이 없으면 예외 발생
    throw new ForbiddenAccessException();
  }

  // 가장 처음에 모두가 접속할 수 있는 main workspace를 생성한다.
  async initializeMainWorkspace() {
    let findOwner = await this.userRepository.findOneBy({
      snowflakeId: MainWorkspace.OWNER_SNOWFLAKEID,
    });

    // 존재하지 않을 때만 생성한다.
    if (!findOwner) {
      // main workspace owner를 생성한다.
      const owner = await this.userRepository.save({
        snowflakeId: MainWorkspace.OWNER_SNOWFLAKEID,
        providerId: MainWorkspace.OWNER_PROVIDER_ID,
        provider: MainWorkspace.OWNER_PROVIDER,
        email: MainWorkspace.OWNER_EMAIL,
      });

      findOwner = owner;
    }
    this.logger.log('main workspace owner가 존재합니다.');

    // main workspace를 찾는다.
    let findWorkspace = await this.workspaceRepository.findOneBy({
      snowflakeId: MainWorkspace.WORKSPACE_SNOWFLAKEID,
    });

    // owner는 존재하지만 워크스페이스가 없으면 생성한다.
    if (!findWorkspace) {
      findWorkspace = await this.workspaceRepository.save({
        snowflakeId: MainWorkspace.WORKSPACE_SNOWFLAKEID,
        owner: findOwner,
        title: MainWorkspace.WORKSPACE_TITLE,
        description: MainWorkspace.WORKSPACE_DESCRIPTION,
        visibility: MainWorkspace.WORKSPACE_VISIBILITY,
      });
      this.logger.log('main workspace를 생성했습니다.');
    }
    this.logger.log('main workspace가 존재합니다.');

    // owner의 role을 찾는다.
    const role = await this.roleRepository.findOne({
      where: {
        workspaceId: findWorkspace.id,
        userId: findOwner.id,
      },
    });

    // owner의 role이 없으면 생성한다.
    if (!role) {
      await this.roleRepository.save({
        workspaceId: findWorkspace.id,
        userId: findOwner.id,
        workspace: findWorkspace,
        user: findOwner,
        role: 'owner',
      });
    }
  }

  async updateVisibility(
    userId: number,
    workspaceId: string,
    visibility: 'public' | 'private',
  ): Promise<void> {
    // 워크스페이스가 존재하는지 확인
    const workspace = await this.workspaceRepository.findOneBy({
      snowflakeId: workspaceId,
    });

    if (!workspace) {
      throw new WorkspaceNotFoundException();
    }

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

    // 가시성 변경
    workspace.visibility = visibility;
    await this.workspaceRepository.save(workspace);
  }
}
