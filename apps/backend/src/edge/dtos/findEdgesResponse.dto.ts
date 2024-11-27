import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';
import { Edge } from '../edge.entity';

export class FindEdgesResponseDto {
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
        fromNode: 2,
        toNode: 7,
      },
    ],
    description: '모든 Edge 배열',
  })
  @IsArray()
  edges: Partial<Edge>[];
}
