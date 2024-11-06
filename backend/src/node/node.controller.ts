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
import { CreateNodeDto, UpdateNodeDto } from './node.dto';

@Controller('node')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createNode(
    @Body() body: CreateNodeDto,
  ): Promise<{ message: string; node: Node }> {
    const node = await this.nodeService.createNode(body);
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
    @Body() body: UpdateNodeDto,
  ): Promise<{ message: string; node: Node }> {
    const node = await this.nodeService.updateNode(id, body);
    return {
      message: 'Node and related Page successfully updated',
      node,
    };
  }
}
