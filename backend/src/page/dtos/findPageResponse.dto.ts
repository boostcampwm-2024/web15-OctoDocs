import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject } from 'class-validator';
import { Page } from '../page.entity';

export class FindPageResponseDto {
  @ApiProperty({
    example: 'OO 생성에 성공했습니다.',
    description: 'api 요청 결과 메시지',
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: {
      type: 'doc',
      content: {},
    },
    description: '모든 Page 배열',
  })
  @IsObject()
  page: Partial<Page>;
}
