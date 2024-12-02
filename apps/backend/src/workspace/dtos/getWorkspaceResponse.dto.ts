import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserWorkspaceDto } from './userWorkspace.dto';

export class GetWorkspaceResponseDto {
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
    ],
    description: '사용자가 접근하려고 하는 워크스페이스 데이터',
  })
  workspace: UserWorkspaceDto;
}
