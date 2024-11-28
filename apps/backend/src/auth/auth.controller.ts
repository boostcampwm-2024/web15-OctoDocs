import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Post,
  Patch,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';
import { MessageResponseDto } from './dtos/messageResponse.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TokenService } from './token/token.service';
import { UpdateUserDto } from './dtos/UpdateUser.dto';

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
    this.tokenService.setAccessTokenCookie(res, accessToken);
    this.tokenService.setRefreshTokenCookie(res, refreshToken);

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
    this.tokenService.setAccessTokenCookie(res, accessToken);
    this.tokenService.setRefreshTokenCookie(res, refreshToken);

    res.redirect(302, '/');
  }

  @ApiResponse({ type: MessageResponseDto })
  @ApiOperation({ summary: '사용자가 로그아웃합니다.' })
  @Post('logout')
  @UseGuards(JwtAuthGuard) // JWT 인증 검사
  logout(@Res() res: Response) {
    // 쿠키 삭제 (옵션이 일치해야 삭제됨)
    this.tokenService.clearCookies(res);
    return res.status(200).json({
      message: AuthResponseMessage.AUTH_LOGGED_OUT,
    });
  }

  // 클라이언트가 사용자의 외부 id(snowflakeId) + 이름을 알 수 있는 엔드포인트
  // auth/profile
  // TODO: 사용자 지정 닉네임 + 프로필 이미지도 return하게 확장
  @Get('profile')
  @UseGuards(JwtAuthGuard) // JWT 인증 검사
  async getProfile(@Req() req) {
    const user = await this.authService.findUserById(req.user.sub);
    // JWT 토큰을 검증하고 사용자 정보 반환
    return {
      message: '인증된 사용자 정보',
      snowflakeId: user.snowflakeId,
    };
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req, @Body() body: UpdateUserDto) {
    await this.authService.updateUser(req.user.sub, body);
  }
}
