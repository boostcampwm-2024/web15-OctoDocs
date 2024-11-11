import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { NodeService } from './node.service';
import { CreateNodeDto, UpdateNodeDto } from './node.dto';

@Controller('node')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createNode(@Body() body: CreateNodeDto): Promise<{ message: string }> {
    await this.nodeService.createNode(body);
    return {
      message: 'Node and reladed Page successfully created',
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
  ): Promise<{ message: string }> {
    await this.nodeService.updateNode(id, body);
    return {
      message: 'Node and related Page successfully updated',
    };
  }

  @Get(':id/coordinates')
  @HttpCode(HttpStatus.OK)
  async getCoordinates(@Param('id', ParseIntPipe) id: number) {
    return await this.nodeService.getCoordinates(id);
  }
}
