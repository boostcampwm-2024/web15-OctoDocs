import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsObject } from 'class-validator';
class Coordinate {
  @IsNumber()
  x: number;
  @IsNumber()
  y: number;
}
export class CoordinateResponseDto {
  @ApiProperty({
    example: 'OO 생성에 성공했습니다.',
    description: 'api 요청 결과 메시지',
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: {
      x: 14,
      y: 14,
    },
    description: 'api 요청 결과 메시지',
  })
  @IsObject()
  coordinate: Coordinate;
}
