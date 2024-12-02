import { IsString, IsJSON, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePartialPageDto {
  @ApiProperty({
    example: 1,
    description: 'page PK',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: '페이지 제목입니다.',
    description: '페이지 제목.',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: "{'doc' : 'type'}",
    description: '페이지 내용 JSON 형태',
  })
  @IsJSON()
  @IsOptional()
  content?: JSON;

  @ApiProperty({
    example: '📝',
    description: '페이지 이모지',
    required: false,
  })
  @IsString()
  @IsOptional()
  emoji?: string;
}
