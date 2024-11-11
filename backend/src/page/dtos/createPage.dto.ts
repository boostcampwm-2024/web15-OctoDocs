import { IsString, IsNumber, IsJSON } from 'class-validator';

export class CreatePageDto {
  @IsString()
  title: string;

  @IsJSON()
  content: JSON;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;
}
