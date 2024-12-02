// src/auth/strategies/naver.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-naver';
import { AuthService } from '../auth.service';
import { SignUpDto } from '../dtos/signUp.dto';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.NAVER_CLIENT_ID, // 환경 변수로 관리
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // 네이버 인증 이후 사용자 정보 처리
    const createUserDto: SignUpDto = {
      providerId: profile.id,
      provider: 'naver',
      email: profile._json.email,
    };
    let user = await this.authService.findUser(createUserDto);
    if (!user) {
      user = await this.authService.signUp(createUserDto);
    }
    return user;
  }
}
