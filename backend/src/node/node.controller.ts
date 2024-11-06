import {
  Controller,
  Post,
  Delete,
  Patch,
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
    @Body('title') title: string,
    @Body('x') x: number,
    @Body('y') y: number,
  ): Promise<{ message: string; node: Node }> {
    const node = await this.nodeService.createNode(x, y, title);
    return {
      message: 'Node and reladed Page successfully created',
      node,
    };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteNode(@Param('id') id: number): Promise<{ message: string }> {
    await this.nodeService.deleteNode(id);
    return {
      message: `Node with ID ${id} successfully deleted`,
    };
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  async updateNode(
    @Param('id') id: number,
    @Body('x') x: number,
    @Body('y') y: number,
    @Body('title') title: string,
  ): Promise<{ message: string; node: Node }> {
    const node = await this.nodeService.updateNode(id, x, y, title);
    return {
      message: 'Node and related Page successfully updated',
      node,
    };
  }
}
