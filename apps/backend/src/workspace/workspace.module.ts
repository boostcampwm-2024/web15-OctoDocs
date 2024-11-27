import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './workspace.entity';
import { WorkspaceRepository } from './workspace.repository';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenService } from '../auth/token/token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace]),
    UserModule,
    RoleModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
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
