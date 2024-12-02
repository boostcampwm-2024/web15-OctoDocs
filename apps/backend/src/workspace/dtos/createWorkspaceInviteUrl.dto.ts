import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateWorkspaceInviteUrlDto {
  @ApiProperty({
    example: 'OO 생성에 성공했습니다.',
    description: 'api 요청 결과 메시지',
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: 'https://octodocs.local/api/workspace/join?token=12345',
    description: '워크스페이스 초대용 링크입니다.',
  })
  @IsString()
  inviteUrl: string;
}
