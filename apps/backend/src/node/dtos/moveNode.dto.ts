import { IsNumber } from 'class-validator';

export class MoveNodeDto {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;
}
