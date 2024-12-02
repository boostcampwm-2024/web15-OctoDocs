import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';

export class CreateWorkspaceDto {
  @ApiProperty({
    example: 'naver-boostcamp-9th',
    description: '워크스페이스 제목입니다.',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: '네이버 부스트캠프 9기 워크스페이스입니다',
    description: '워크스페이스 설명입니다.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'private',
    description: '워크스페이스 전체 공개 여부입니다. default는 private입니다.',
  })
  @IsOptional()
  @IsIn(['public', 'private'])
  visibility?: 'public' | 'private';

  @ApiProperty({
    example: 'thumbnail-url-1',
    description: '워크스페이스 표지 이미지 url입니다.',
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;
}
