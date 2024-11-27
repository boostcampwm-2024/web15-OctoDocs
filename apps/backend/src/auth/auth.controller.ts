import { Controller, Get, UseGuards, Req, Res, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';
import { MessageResponseDto } from './dtos/messageResponse.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TokenService } from './token/token.service';

const HALF_YEAR = 6 * 30 * 24 * 60 * 60 * 1000;

export enum AuthResponseMessage {
  AUTH_LOGGED_OUT = '로그아웃하였습니다.',
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverLogin() {
    // 네이버 로그인 페이지로 리디렉션
    // Passport가 리디렉션 처리
  }

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverCallback(@Req() req, @Res() res: Response) {
    // 네이버 인증 후 사용자 정보 반환
    const user = req.user;

    // primary Key인 id 포함 payload 생성함
    // TODO: 여기서 권한 추가해야함
    const payload = { sub: user.id };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    // 토큰을 쿠키에 담아서 메인 페이지로 리디렉션
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict', // CSRF 방지
      maxAge: HALF_YEAR,
      expires: new Date(Date.now() + HALF_YEAR),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict', // CSRF 방지
      maxAge: HALF_YEAR,
      expires: new Date(Date.now() + HALF_YEAR),
    });

    res.redirect(302, '/');
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    // 카카오 로그인 페이지로 리디렉션
    // Passport가 리디렉션 처리
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(@Req() req, @Res() res: Response) {
    /// 카카오 인증 후 사용자 정보 반환
    const user = req.user;

    // primary Key인 id 포함 payload 생성함
    // TODO: 여기서 권한 추가해야함
    const payload = { sub: user.id };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    // 토큰을 쿠키에 담아서 메인 페이지로 리디렉션
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict', // CSRF 방지
      maxAge: HALF_YEAR,
      expires: new Date(Date.now() + HALF_YEAR),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict', // CSRF 방지
      maxAge: HALF_YEAR,
      expires: new Date(Date.now() + HALF_YEAR),
    });

    res.redirect(302, '/');
  }

  @ApiResponse({ type: MessageResponseDto })
  @ApiOperation({ summary: '사용자가 로그아웃합니다.' })
  @Post('logout')
  logout(@Res() res: Response) {
    // 쿠키 삭제 (옵션이 일치해야 삭제됨)
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return res.status(200).json({
      message: AuthResponseMessage.AUTH_LOGGED_OUT,
    });
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
