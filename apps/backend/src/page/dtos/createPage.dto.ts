import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsJSON, IsOptional } from 'class-validator';

export class CreatePageDto {
  @ApiProperty({
    example: 'nest.js 사용법',
    description: '페이지 제목입니다.',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'nest를 설치합니다.',
    description: '페이지 내용입니다.',
  })
  @IsJSON()
  content: JSON;

  @ApiProperty({
    example: '14',
    description: 'x 좌표입니다.',
  })
  @IsNumber()
  x: number;

  @ApiProperty({
    example: '14',
    description: 'y 좌표입니다.',
  })
  @IsNumber()
  y: number;

  @ApiProperty({
    example: '📝',
    description: '페이지 이모지',
    required: false,
  })
  @IsString()
  @IsOptional()
  emoji?: string;
}
