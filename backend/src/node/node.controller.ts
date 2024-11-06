import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NodeService } from './node.service';
import { Node } from './node.entity';

@Controller('node')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createNode(
    @Body('x') x: number,
    @Body('y') y: number,
    @Body('title') title: string,
  ): Promise<{ message: string; node: Node }> {
    const node = await this.nodeService.createNode(x, y, title);
    return {
      message: 'Node and reladed Page successfully created',
      node,
    };
  }

  @Delete('/:id')
  async deleteNode(@Param('id') id: number): Promise<void> {
    return await this.nodeService.deleteNode(id);
  }
}
