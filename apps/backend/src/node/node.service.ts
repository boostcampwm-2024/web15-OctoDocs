import { Injectable } from '@nestjs/common';
import { NodeRepository } from './node.repository';
import { PageRepository } from '../page/page.repository';
import { Node } from './node.entity';
import { CreateNodeDto } from './dtos/createNode.dto';
import { UpdateNodeDto } from './dtos/updateNode.dto';
import { NodeNotFoundException } from '../exception/node.exception';
import { MoveNodeDto } from './dtos/moveNode.dto';

@Injectable()
export class NodeService {
  constructor(
    private readonly nodeRepository: NodeRepository,
    private readonly pageRepository: PageRepository,
  ) {}

  async createNode(dto: CreateNodeDto): Promise<Node> {
    const { title, x, y } = dto;

    // 노드부터 생성한다.
    const node = await this.nodeRepository.save({ title, x, y });

    // 페이지를 생성한다.
    const page = await this.pageRepository.save({ title, content: {} });

    // 페이지와 노드를 서로 연결하여 저장한다.
    node.page = page;
    return await this.nodeRepository.save(node);
  }

  async createLinkedNode(x: number, y: number, pageId: number): Promise<Node> {
    // 페이지를 조회한다.
    const existingPage = await this.pageRepository.findOneBy({ id: pageId });
    // 노드를 생성한다.
    const node = this.nodeRepository.create({ x, y });

    node.page = existingPage;
    return await this.nodeRepository.save(node);
  }

  async deleteNode(id: number): Promise<void> {
    // 노드를 삭제한다.
    const deleteResult = await this.nodeRepository.delete(id);

    // 만약 삭제된 노드가 없으면 노드를 찾지 못한 것
    if (!deleteResult.affected) {
      throw new NodeNotFoundException();
    }
  }

  async updateNode(id: number, dto: UpdateNodeDto): Promise<Node> {
    // 노드를 조회한다.
    const node = await this.nodeRepository.findOne({
      relations: ['page'],
      select: {
        id: true,
        page: {
          id: true,
          title: true, // content 제외하고 title만 선택
        },
      },
      where: {
        id,
      },
    });

    // 노드가 없으면 NotFound 에러
    if (!node) {
      throw new NodeNotFoundException();
    }
    // 노드와 연결된 페이지를 조회한다.
    const linkedPage = await this.pageRepository.findOneBy({
      id: node.page.id,
    });

    // 노드 정보를 갱신한다.
    const { x, y, title } = dto;
    node.x = x;
    node.y = y;
    linkedPage.title = title;

    return await this.nodeRepository.save(node);
  }

  async findNodeById(id: number): Promise<Node> {
    // 노드를 조회한다.
    const node = await this.nodeRepository.findOne({
      relations: ['page'],
      select: {
        id: true,
        page: {
          id: true,
          title: true, // content 제외하고 title만 선택
        },
      },
      where: {
        id,
      },
    });

    // 노드가 없으면 NotFound 에러
    if (!node) {
      throw new NodeNotFoundException();
    }
    return node;
  }

  async findNodes(): Promise<Node[]> {
    // 노드를 조회한다.
    const nodes = await this.nodeRepository.find({
      relations: ['page'],
      select: {
        id: true,
        page: {
          id: true,
          title: true, // content 제외하고 title만 선택
        },
      },
    });
    // 노드가 없으면 NotFound 에러
    if (!nodes) {
      throw new NodeNotFoundException();
    }
    return nodes;
  }

  async getCoordinates(id: number): Promise<{ x: number; y: number }> {
    // 노드를 조회한다.
    const node = await this.findNodeById(id);

    // 좌표를 반환한다.
    return {
      x: node.x,
      y: node.y,
    };
  }

  async moveNode(id: number, dto: MoveNodeDto): Promise<void> {
    const { x, y } = dto;
    // 갱신할 노드를 조회한다.
    const node = await this.findNodeById(id);

    // 노드가 없으면 NotFound 에러
    if (!node) {
      throw new NodeNotFoundException();
    }

    // UPDATE 쿼리를 실행한다.
    await this.nodeRepository.update(id, { x, y });
  }
}
