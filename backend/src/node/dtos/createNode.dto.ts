import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateNodeDto {
  @ApiProperty({
    example: '노드 제목',
    description: '노드 제목',
  })
  @IsString()
  title: string;

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
}
