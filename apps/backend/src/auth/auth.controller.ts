import { Controller, Get, UseGuards, Req, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverLogin() {
    // 네이버 로그인 페이지로 리디렉션
    // Passport가 리디렉션 처리
  }

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverCallback(@Req() req) {
    // 네이버 인증 후 사용자 정보 반환
    const user = req.user;
    // TODO: 후에 권한 (workspace 조회, 편집 기능)도 payload에 추가
    const payload = { sub: user.id, provider: user.provider };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return {
      message: '네이버 로그인 성공',
      user,
      accessToken,
      refreshToken,
    };
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    // 카카오 로그인 페이지로 리디렉션
    // Passport가 리디렉션 처리
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(@Req() req) {
    // 카카오 인증 후 사용자 정보 반환
    const user = req.user;
    // TODO: 후에 권한 (workspace 조회, 편집 기능)도 payload에 추가
    const payload = { sub: user.id, provider: user.provider };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return {
      message: '카카오 로그인 성공',
      user,
      accessToken,
      refreshToken,
    };
  }

  @Post('refresh')
  async refreshAccessToken(@Req() req) {
    const { refreshToken } = req.body;

    const decoded = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_SECRET,
    });
    const payload = { sub: decoded.sub, provider: decoded.provider };
    const newAccessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    return {
      message: '새로운 Access Token 발급 성공',
      accessToken: newAccessToken,
    };
  }

  // Example: 로그인한 사용자만 접근할 수 있는 엔드포인트
  // auth/profile
  @Get('profile')
  @UseGuards(JwtAuthGuard) // JWT 인증 검사
  async getProfile(@Req() req) {
    // JWT 토큰을 검증하고 사용자 정보 반환
    return {
      message: '인증된 사용자 정보',
      user: req.user,
    };
  }
}
