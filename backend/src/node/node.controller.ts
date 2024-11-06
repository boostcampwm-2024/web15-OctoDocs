import { Controller, Delete, Param } from '@nestjs/common';
import { NodeService } from './node.service';

@Controller('node')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Delete(':id')
  deleteNode(@Param('id') id: number): Promise<void> {
    return this.nodeService.deleteNode(id);
  }
}
