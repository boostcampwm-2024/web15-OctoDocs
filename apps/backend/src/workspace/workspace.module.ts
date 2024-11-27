import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './workspace.entity';
import { WorkspaceRepository } from './workspace.repository';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace]), UserModule, RoleModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceRepository, JwtAuthGuard],
  exports: [WorkspaceService, WorkspaceRepository],
})
export class WorkspaceModule {}
