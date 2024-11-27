import {
  Controller,
  Post,
  Delete,
  Get,
  UseGuards,
  Request,
  Body,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WorkspaceService } from './workspace.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessageResponseDto } from './dtos/messageResponse.dto';
import { CreateWorkspaceDto } from './dtos/createWorkspace.dto';
import { UserWorkspaceDto } from './dtos/userWorkspace.dto';
import { CreateWorkspaceResponseDto } from './dtos/createWorkspaceResponse.dto';
import { GetUserWorkspacesResponseDto } from './dtos/getUserWorkspacesResponse.dto';

export enum WorkspaceResponseMessage {
  WORKSPACE_CREATED = '워크스페이스를 생성했습니다.',
  WORKSPACE_DELETED = '워크스페이스를 삭제했습니다.',
  WORKSPACES_RETURNED = '사용자가 참여하고 있는 모든 워크스페이스들을 가져왔습니다',
  WORKSPACE_INVITED = '워크스페이스 게스트 초대 링크가 생성되었습니다',
}

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @ApiResponse({
    type: CreateWorkspaceResponseDto,
  })
  @ApiOperation({ summary: '워크스페이스를 생성합니다.' })
  @ApiBody({
    description: 'post',
    type: CreateWorkspaceDto,
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createWorkspace(
    @Request() req,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    const userId = req.user.sub; // 인증된 사용자의 ID
    const newWorkspace = await this.workspaceService.createWorkspace(
      userId,
      createWorkspaceDto,
    );
    return {
      message: WorkspaceResponseMessage.WORKSPACE_CREATED,
      workspaceId: newWorkspace.snowflakeId,
    };
  }

  @ApiResponse({
    type: MessageResponseDto,
  })
  @ApiOperation({
    summary:
      '워크스페이스를 삭제하고 해당 워크스페이스의 권한 정보도 삭제합니다. (cascade delete)',
  })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteWorkspace(@Request() req, @Param('id') id: string) {
    const userId = req.user.sub; // 인증된 사용자의 ID
    await this.workspaceService.deleteWorkspace(userId, id);

    return {
      message: WorkspaceResponseMessage.WORKSPACE_DELETED,
    };
  }

  @ApiResponse({ type: GetUserWorkspacesResponseDto })
  @ApiOperation({
    summary: '사용자가 참여 중인 워크스페이스 목록을 가져옵니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/user')
  @HttpCode(HttpStatus.OK)
  async getUserWorkspaces(@Request() req) {
    const userId = req.user.sub; // 인증된 사용자의 ID
    const workspaces = this.workspaceService.getUserWorkspaces(userId);
    return {
      message: WorkspaceResponseMessage.WORKSPACES_RETURNED,
      workspaces,
    };
  }

  // TODO: 후에 역할 나눠서 초대링크 만들 수 있게 확장
  @Post('/:id/invite')
  @UseGuards(JwtAuthGuard) // 로그인 인증
  @HttpCode(HttpStatus.CREATED)
  async generateInviteLink(
    @Request() req,
    @Param('workspaceId') workspaceId: string,
  ) {
    const userId = req.user.sub; // 인증된 사용자 ID
    const inviteUrl = await this.workspaceService.generateInviteToken(
      userId,
      id,
    );

    return {
      message: '초대 URL이 생성되었습니다.',
      inviteUrl,
    };
  }
}
