import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { NodeService } from './node.service';

@Controller('node')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Get(':id/coordinates')
  async getCoordinates(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.nodeService.getCoordinates(id);
    } catch (error) {
      // ! 의미상 204가 더 맞는 것 같은데, 보낼 방법이 없음
      // TODO: express 에서 Response 가져와서 .status(204)로 보내는게 적합한지 토의 필요
      throw new NotFoundException(error.message);
    }
  }
}
