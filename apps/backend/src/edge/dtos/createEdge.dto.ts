import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateEdgeDto {
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: '출발 노드의 ID',
  })
  fromNode: number;

  @IsNumber()
  @ApiProperty({
    example: 1,
    description: '도착 노드의 ID',
  })
  toNode: number;
}
