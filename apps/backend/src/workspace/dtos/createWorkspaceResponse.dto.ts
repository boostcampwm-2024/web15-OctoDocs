import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateWorkspaceResponseDto {
  @ApiProperty({
    example: 'OO 생성에 성공했습니다.',
    description: 'api 요청 결과 메시지',
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: 'snowflake-id-1',
    description: '페이지의 외부 키 (snowflakeId)',
  })
  @IsString()
  workspaceId: string;
}
