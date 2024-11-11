import { IsString, IsNumber } from 'class-validator';

export class UpdateNodeDto {
  @IsString()
  title: string;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;
}
