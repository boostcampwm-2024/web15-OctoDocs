import { Module, forwardRef } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './workspace.entity';
import { WorkspaceRepository } from './workspace.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace]),
    forwardRef(() => UserModule),
  ],
  providers: [WorkspaceService, WorkspaceRepository],
  controllers: [WorkspaceController, WorkspaceRepository],
})
export class WorkspaceModule {}
