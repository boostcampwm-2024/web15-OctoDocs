import { IsString, IsArray } from 'class-validator';
import { Node } from '../node.entity';

export class FindNodesResponseDto {
  @IsString()
  message: string;

  @IsArray()
  nodes: Node[];
}
