import { IsString, IsNumber } from 'class-validator';

export class CreateNodeDto {
  @IsString()
  title: string;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;
}
