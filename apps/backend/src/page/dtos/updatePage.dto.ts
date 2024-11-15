import { IsString, IsJSON } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePageDto {
  @ApiProperty({
    example: '페이지 제목입니다.',
    description: '페이지 제목.',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: "{'doc' : 'type'}",
    description: '페이지 내용 JSON 형태',
  })
  @IsJSON()
  content: JSON;
}
