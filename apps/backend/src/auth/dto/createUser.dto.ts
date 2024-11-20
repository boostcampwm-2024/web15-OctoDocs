import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    example: 'abc1234',
    description: '사용자의 카카오/네이버 아이디',
  })
  providerId: string;

  @IsString()
  @IsIn(['naver', 'kakao'], {
    message: 'provider는 naver 또는 kakao 중 하나여야 합니다.',
  })
  @ApiProperty({
    example: 'naver',
    description: '연동되는 서비스: 네이버/카카오',
  })
  provider: string;

  @IsEmail()
  @ApiProperty({
    example: 'abc1234@naver.com',
    description: '사용자의 카카오/네이버 이메일 주소',
  })
  email: string;
}
