import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsIn } from 'class-validator';
// import { Direction } from '../edge.entity';

const Direction = ['N', 'S', 'E', 'W'];

export class CreateEdgeDto {
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: '출발 노드의 ID',
  })
  fromNode: number;

  @IsString()
  @IsIn(Direction)
  @ApiProperty({
    example: 'N',
    description: '출발 노드 지점 방향 (N, S, E, W 중 하나)',
  })
  fromPoint: string;

  @IsNumber()
  @ApiProperty({
    example: 1,
    description: '도착 노드의 ID',
  })
  toNode: number;

  @IsString()
  @IsIn(Direction)
  @ApiProperty({
    example: 'N',
    description: '도착 노드 지점 방향 (N, S, E, W 중 하나)',
  })
  toPoint: string;
}
