import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

const HOUR = 60 * 60;
const DAY = 24 * 60 * 60;
const FIVE_MONTHS = 5 * 30 * 24 * 60 * 60;
const MS_HALF_YEAR = 6 * 30 * 24 * 60 * 60 * 1000;

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload, {
      expiresIn: HOUR,
    });
  }

  generateRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, {
      expiresIn: FIVE_MONTHS,
    });
  }

  generateInviteToken(workspaceId: number, role: string): string {
    // 초대용 JWT 토큰 생성
    const payload = { workspaceId, role };

    return this.jwtService.sign(payload, {
      expiresIn: DAY, // 초대 유효 기간: 1일
      secret: process.env.JWT_SECRET,
    });
  }

  verifyInviteToken(token: string): { workspaceId: string; role: string } {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    // refreshToken을 검증한다
    const decoded = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_SECRET,
    });

    // 새로운 accessToken을 발급한다
    return this.generateAccessToken({ sub: decoded.sub });
  }

  setAccessTokenCookie(response: Response, accessToken: string): void {
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: MS_HALF_YEAR,
      expires: new Date(Date.now() + MS_HALF_YEAR),
    });
  }

  setRefreshTokenCookie(response: Response, refreshToken: string): void {
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: MS_HALF_YEAR,
      expires: new Date(Date.now() + MS_HALF_YEAR),
    });
  }

  clearCookies(response: Response) {
    response.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }
}
