import { IsString, IsObject } from 'class-validator';
import { Node } from '../node.entity';

export class FindNodeResponseDto {
  @IsString()
  message: string;

  @IsObject()
  node: Node;
}
