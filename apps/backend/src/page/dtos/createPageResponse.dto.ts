import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreatePageResponseDto {
  @ApiProperty({
    example: 'OO 생성에 성공했습니다.',
    description: 'api 요청 결과 메시지',
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: 1,
    description: '페이지의 PK',
  })
  @IsInt()
  pageId: number;
}
