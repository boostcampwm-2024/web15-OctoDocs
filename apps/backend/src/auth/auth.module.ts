import { Module } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NaverStrategy } from './strategies/naver.strategy';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TokenModule } from './token/token.module';

@Module({
  imports: [UserModule, TokenModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    NaverStrategy,
    KakaoStrategy,
    UserRepository,
    JwtAuthGuard,
  ],
})
export class AuthModule {}
