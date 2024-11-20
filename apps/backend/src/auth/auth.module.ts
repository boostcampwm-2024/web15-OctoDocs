import { Module } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NaverStrategy } from './strategies/naver.strategy';
import { KakaoStrategy } from './strategies/kakao.strategy';
@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, NaverStrategy, KakaoStrategy, UserRepository],
})
export class AuthModule {}
