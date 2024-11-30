import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { RedisModule } from '../redis/redis.module';
import { PageModule } from '../page/page.module';

@Module({
  imports: [RedisModule, PageModule],
  providers: [TasksService],
})
export class TasksModule {}
