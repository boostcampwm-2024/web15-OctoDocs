import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PageModule } from '../page/page.module';

@Module({
  imports: [RedisModule, PageModule],
  providers: [TasksService],
})
export class RedisModule {}
