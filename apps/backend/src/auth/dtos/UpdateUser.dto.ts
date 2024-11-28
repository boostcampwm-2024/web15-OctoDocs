import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsJSON,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'abc123',
    description: 'user의 snowflake id',
  })
  @IsString()
  snowflakeId: string;

  @ApiProperty({
    example: '#FF8A8A',
    description: '유저의 커서 색상',
  })
  @IsString()
  @IsOptional()
  cursorColor?: string;
  
  @ApiProperty({
    example: '#FF8A8A',
    description: '유저의 커서 색상',
  })
  @IsString()
  @IsOptional()
  nickname?: string;
}
