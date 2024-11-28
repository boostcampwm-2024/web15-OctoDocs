import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';
import { UserWorkspaceDto } from './userWorkspace.dto';

export class GetUserWorkspacesResponseDto {
  @ApiProperty({
    example: 'OO 생성에 성공했습니다.',
    description: 'api 요청 결과 메시지',
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: [
      {
        workspaceId: 'snowflake-id-1',
        title: 'naver-boostcamp-9th',
        description: '네이버 부스트캠프 9기 워크스페이스입니다',
        thumbnailUrl: 'https://example.com/image1.png',
        role: 'guest',
        visibility: 'private',
      },
      {
        workspaceId: 'snowflake-id-2',
        title: '2024-fall-컴퓨터구조',
        description: null,
        thumbnailUrl: null,
        role: 'owner',
        visibility: 'public',
      },
    ],
    description: '사용자가 속한 모든 워크스페이스 배열',
  })
  @IsArray()
  workspaces: UserWorkspaceDto[];
}
