import { ApiProperty } from '@nestjs/swagger';

export class CreateEdgeDto {
  fromNode: number;
  fromPoint: string;
  toNode: number;
  toPoint: string;
}
