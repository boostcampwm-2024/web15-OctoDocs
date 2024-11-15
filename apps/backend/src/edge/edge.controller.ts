import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { EdgeService } from './edge.service';
import { CreateEdgeDto } from './dtos/createEdge.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MessageResponseDto } from './dtos/messageResponse.dto';
import { FindEdgesResponseDto } from './dtos/findEdgesResponse.dto';

export enum EdgeResponseMessage {
  EDGE_ALL_RETURNED = '모든 엣지를 가져왔습니다.',
  EDGE_CREATED = '엣지를 생성했습니다.',
  EDGE_DELETED = '엣지를 삭제했습니다.',
}

@Controller('edge')
export class EdgeController {
  constructor(private readonly edgeService: EdgeService) {}

  @ApiResponse({
    type: FindEdgesResponseDto,
  })
  @ApiOperation({
    summary: '모든 엣지 정보를 가져옵니다.',
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getNodes() {
    const nodes = await this.edgeService.findEdges();
    return {
      message: EdgeResponseMessage.EDGE_ALL_RETURNED,
      nodes: nodes,
    };
  }

  @ApiResponse({ type: MessageResponseDto })
  @ApiOperation({ summary: '엣지를 생성합니다.' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createEdge(@Body() body: CreateEdgeDto) {
    await this.edgeService.createEdge(body);
    return {
      message: EdgeResponseMessage.EDGE_CREATED,
    };
  }

  @ApiResponse({ type: MessageResponseDto })
  @ApiOperation({ summary: '엣지를 삭제합니다.' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteNode(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.edgeService.deleteEdge(id);
    return {
      message: EdgeResponseMessage.EDGE_DELETED,
    };
  }
}
