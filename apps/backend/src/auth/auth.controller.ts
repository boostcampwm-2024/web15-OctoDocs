import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverLogin() {
    // 네이버 로그인 페이지로 리디렉션
  }

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverCallback(@Req() req) {
    // 네이버 인증 후 콜백 처리
    return req.user;
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    // 카카오 로그인 페이지로 리디렉션
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(@Req() req) {
    // 카카오 인증 후 콜백 처리
    return req.user;
  }
}
