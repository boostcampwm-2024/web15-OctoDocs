import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ImageUploadResponseDto {
  @ApiProperty({
    example: '이미지 업로드 성공',
    description: 'api 요청 결과 메시지',
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: 'https://kr.object.ncloudstorage.com/octodocs-static/uploads/name',
    description: '업로드된 이미지 url',
  })
  @IsString()
  url: string;
}
