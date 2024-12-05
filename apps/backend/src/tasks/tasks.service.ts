import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  RedisEdge,
  RedisPage,
  RedisNode,
  RedisService,
} from '../redis/redis.service';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Page } from '../page/page.entity';
import { Node } from '../node/node.entity';
import { Edge } from '../edge/edge.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private readonly redisService: RedisService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    this.logger.log('스케줄러 시작');
    // 시작 시간
    const startTime = performance.now();
    const pageKeys = await this.redisService.getAllKeys('page:*');
    const nodeKeys = await this.redisService.getAllKeys('node:*');
    const edgeKeys = await this.redisService.getAllKeys('edge:*');

    Promise.allSettled([
      ...pageKeys.map(this.migratePage.bind(this)),
      ...nodeKeys.map(this.migrateNode.bind(this)),
      ...edgeKeys.map(this.migrateEdge.bind(this)),
    ])
      .then((results) => {
        const endTime = performance.now();
        this.logger.log(`총 개수 : ${results.length}개`);
        this.logger.log(
          `성공 개수 : ${results.filter((result) => result.status === 'fulfilled').length}개`,
        );
        this.logger.log(
          `실패 개수 : ${results.filter((result) => result.status === 'rejected').length}개`,
        );
        this.logger.log(`실행 시간 : ${(endTime - startTime) / 1000}초`);
      })
      .catch((err) => {
        this.logger.error(err);
      });
  }

  async migratePage(key: string) {
    const redisData = (await this.redisService.get(key)) as RedisPage;
    // 데이터 없으면 오류
    if (!redisData) {
      throw new Error(`redis에 ${key}에 해당하는 데이터가 없습니다.`);
    }

    const { title, content, emoji } = redisData;

    const updateData: Partial<Page> = {};

    if (title) updateData.title = title;
    if (content) updateData.content = JSON.parse(content);
    if (emoji) updateData.emoji = emoji;

    // 업데이트 대상이 없다면 리턴
    if (Object.keys(updateData).length === 0) return;
    const pageId = parseInt(key.split(':')[1]);

    // 트랜잭션 시작
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();

      // 갱신 시작
      const pageRepository = queryRunner.manager.getRepository(Page);

      // TODO : 페이지가 없으면 affect : 0을 반환하는데 이 부분 처리도 하는 게 좋을 듯...?
      await pageRepository.update(pageId, updateData);

      // redis에서 데이터 삭제
      await this.redisService.delete(key);

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();
    } catch (err) {
      // 실패하면 postgres는 roll back하고 redis의 값을 살린다.
      this.logger.error(err.stack);
      await queryRunner.rollbackTransaction();
      updateData.title &&
        (await this.redisService.setField(key, 'title', updateData.title));
      updateData.content &&
        (await this.redisService.setField(key, 'content', JSON.parse(content)));
      updateData.emoji &&
        (await this.redisService.setField(key, 'emoji', updateData.emoji));

      // Promise.all에서 실패를 인식하기 위해 에러를 던진다.
      throw err;
    } finally {
      // 리소스 정리
      await queryRunner.release();
    }
  }

  async migrateNode(key: string) {
    const redisData = (await this.redisService.get(
      key,
    )) as unknown as RedisNode;
    // 데이터 없으면 오류
    if (!redisData) {
      throw new Error(`redis에 ${key}에 해당하는 데이터가 없습니다.`);
    }

    const { x, y, color } = redisData;
    const updateData: Partial<Node> = {};

    if (x) updateData.x = Number(x);
    if (y) updateData.y = Number(y);
    if (color) updateData.color = color;

    // 쿼리 대상이 없다면 리턴
    if (Object.keys(updateData).length === 0) return;
    const nodeId = parseInt(key.split(':')[1]);

    // 트랜잭션 시작
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();

      // 갱신 시작
      const nodeRepository = queryRunner.manager.getRepository(Node);

      // TODO : 페이지가 없으면 affect : 0을 반환하는데 이 부분 처리도 하는 게 좋을 듯...?
      await nodeRepository.update(nodeId, updateData);

      // redis에서 데이터 삭제
      await this.redisService.delete(key);

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();
    } catch (err) {
      // 실패하면 postgres는 roll back하고 redis의 값을 살린다.
      this.logger.error(err.stack);
      await queryRunner.rollbackTransaction();
      updateData.x &&
        (await this.redisService.setField(key, 'x', updateData.x.toString()));
      updateData.y &&
        (await this.redisService.setField(key, 'y', updateData.y.toString()));
      updateData.color &&
        (await this.redisService.setField(key, 'color', updateData.color));

      // Promise.all에서 실패를 인식하기 위해 에러를 던진다.
      throw err;
    } finally {
      // 리소스 정리
      await queryRunner.release();
    }
  }

  async migrateEdge(key: string) {
    const redisData = (await this.redisService.get(
      key,
    )) as unknown as RedisEdge;
    // 데이터 없으면 오류
    if (!redisData) {
      throw new Error(`redis에 ${key}에 해당하는 데이터가 없습니다.`);
    }

    // 트랜잭션 시작
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();

      // 갱신 시작
      const edgeRepository = queryRunner.manager.getRepository(Edge);
      const nodeRepository = queryRunner.manager.getRepository(Node);

      const fromNode = await nodeRepository.findOne({
        where: { id: redisData.fromNode },
        relations: ['workspace'],
      });

      const toNode = await nodeRepository.findOne({
        where: { id: redisData.toNode },
      });

      if (redisData.type === 'add') {
        await edgeRepository.save({
          fromNode,
          toNode,
          workspace: fromNode.workspace,
        });
      }

      if (redisData.type === 'delete') {
        const edge = await edgeRepository.findOne({
          where: { fromNode, toNode },
        });

        await edgeRepository.delete({ id: edge.id });
      }

      // redis에서 데이터 삭제
      await this.redisService.delete(key);

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();
    } catch (err) {
      // 실패하면 postgres는 roll back하고 redis의 값을 살린다.
      this.logger.error(err.stack);
      await queryRunner.rollbackTransaction();
      await this.redisService.setField(
        key,
        'fromNode',
        redisData.fromNode.toString(),
      );
      await this.redisService.setField(
        key,
        'toNode',
        redisData.toNode.toString(),
      );
      await this.redisService.setField(key, 'type', redisData.type);

      // Promise.all에서 실패를 인식하기 위해 에러를 던진다.
      throw err;
    } finally {
      // 리소스 정리
      await queryRunner.release();
    }
  }
}
