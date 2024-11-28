import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class GetWorkspaceAccessResponseDto {
  @ApiProperty({
    example: 'OO 생성에 성공했습니다.',
    description: 'api 요청 결과 메시지',
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: 'owner',
    description:
      '워크스페이스에서의 사용자의 권한 (owner, guest, public, forbidden)',
  })
  @IsIn(['owner', 'guest', 'public', 'forbidden'])
  acccess: 'owner' | 'guest' | 'public' | 'forbidden';
}
