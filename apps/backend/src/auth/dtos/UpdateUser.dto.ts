import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: '#FF8A8A',
    description: '유저의 커서 색상',
  })
  @IsString()
  @IsOptional()
  cursorColor?: string;

  @ApiProperty({
    example: 'nickname',
    description: '유저 닉네임',
  })
  @IsString()
  @IsOptional()
  nickname?: string;
}
