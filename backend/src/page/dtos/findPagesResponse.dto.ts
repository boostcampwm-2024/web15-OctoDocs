import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';
import { Page } from '../page.entity';

export class FindPagesResponseDto {
  @ApiProperty({
    example: 'OO 생성에 성공했습니다.',
    description: 'api 요청 결과 메시지',
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: [
      {
        id: 1,
        title: '페이지 제목',
        content: {
          type: 'doc',
          content: {},
        },
      },
    ],
    description: '모든 Page 배열',
  })
  @IsArray()
  pages: Partial<Page>[];
}
