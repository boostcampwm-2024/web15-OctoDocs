import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from '../../user/user.repository';
import { UserNotFoundException } from '../../exception/user.exception';
import { InvalidTokenException } from '../../exception/invalid.exception';

const HOUR = 60 * 60;
const DAY = 24 * 60 * 60;
const FIVE_MONTHS = 5 * 30 * 24 * 60 * 60;
const MS_HALF_YEAR = 6 * 30 * 24 * 60 * 60 * 1000;

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  generateAccessToken(userId: number): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload, {
      expiresIn: HOUR,
    });
  }

  async generateRefreshToken(userId: number): Promise<string> {
    // 보안성을 높이기 위해 랜덤한 tokenId인 jti를 생성한다
    const payload = { sub: userId, jti: uuidv4() };
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: FIVE_MONTHS,
    });

    await this.updateRefreshToken(userId, refreshToken);

    return refreshToken;
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
    // refreshToken 1차 검증
    const decoded = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_SECRET,
    });

    // 검증된 토큰에서 사용자 ID 추출
    const userId = decoded.sub;

    // refreshToken 2차 검증
    // DB에 저장된 refreshToken과 비교
    const isValid = await this.compareStoredRefreshToken(userId, refreshToken);
    if (!isValid) {
      throw new InvalidTokenException();
    }

    // 새로운 accessToken을 발급한다
    return this.generateAccessToken(decoded.sub);
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

  private async compareStoredRefreshToken(
    id: number,
    refreshToken: string,
  ): Promise<boolean> {
    // 유저를 찾는다.
    const user = await this.userRepository.findOneBy({ id });

    // 유저가 없으면 오류
    if (!user) {
      throw new UserNotFoundException();
    }

    // DB에 있는 값과 일치하는지 비교한다
    return user.refreshToken === refreshToken;
  }

  private async updateRefreshToken(id: number, refreshToken: string) {
    // 유저를 찾는다.
    const user = await this.userRepository.findOneBy({ id });

    // 유저가 없으면 오류
    if (!user) {
      throw new UserNotFoundException();
    }

    // 유저의 현재 REFRESH TOKEN 갱신
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);
  }

  async deleteRefreshToken(id: number) {
    // 유저를 찾는다.
    const user = await this.userRepository.findOneBy({ id });

    // 유저가 없으면 오류
    if (!user) {
      throw new UserNotFoundException();
    }

    // 유저의 현재 REFRESH TOKEN 삭제
    user.refreshToken = null;
    await this.userRepository.save(user);
  }
}
