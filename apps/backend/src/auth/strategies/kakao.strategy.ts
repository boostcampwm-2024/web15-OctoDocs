// src/auth/strategies/kakao.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { AuthService } from '../auth.service';
import { SignUpDto } from '../dtos/signUp.dto';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // 카카오 인증 이후 사용자 정보 처리
    const createUserDto: SignUpDto = {
      providerId: profile.id,
      provider: 'kakao',
      email: profile._json.kakao_account.email,
    };
    let user = await this.authService.findUser(createUserDto);
    if (!user) {
      user = await this.authService.signUp(createUserDto);
    }
    return user; // req.user로 반환
  }
}
