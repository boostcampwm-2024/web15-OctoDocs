import { IsString, IsJSON } from 'class-validator';

export class UpdatePageDto {
  @IsString()
  title: string;

  @IsJSON()
  content: JSON;
}
