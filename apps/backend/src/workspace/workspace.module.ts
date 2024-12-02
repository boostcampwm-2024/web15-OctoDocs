import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './workspace.entity';
import { WorkspaceRepository } from './workspace.repository';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TokenModule } from '../auth/token/token.module';
import { TokenService } from '../auth/token/token.service';
import { ConfigModule } from '@nestjs/config'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace]),
    UserModule,
    RoleModule,
    TokenModule,
    ConfigModule,
  ],
  controllers: [WorkspaceController],
  providers: [
    WorkspaceService,
    WorkspaceRepository,
    JwtAuthGuard,
    TokenService,
  ],
  exports: [WorkspaceService, WorkspaceRepository],
})
export class WorkspaceModule {}
