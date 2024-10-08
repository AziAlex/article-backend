import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Cookies, UserAgent } from 'libs/common/src/decorators';
import { Token } from 'src/user/entitys.ts/token.entity';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() userDto: GetUserDto,
    @UserAgent() userAgent: string,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      userDto,
      userAgent,
    );
    this.setAuthHeadersAndCookies(res, accessToken, refreshToken);
    return res.status(200).json({ message: 'login success' });
  }

  @Post('registration')
  async registration(
    @Body() userDto: GetUserDto,
    @UserAgent() userAgent: string,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.registration(
      userDto,
      userAgent,
    );
    this.setAuthHeadersAndCookies(res, accessToken, refreshToken);
    return { message: 'register success.' };
  }

  @Post('refresh-token')
  async refreshTokens(
    @Res() res: Response,
    @Cookies('refreshToken') token: Token,
  ) {
    if (!token) {
      throw new BadRequestException('Refresh token not found.');
    }
    const { accessToken, refreshToken } =
      await this.authService.refreshTokens(token);
    this.setAuthHeadersAndCookies(res, accessToken, refreshToken);
    res.status(200).json({ message: 'refresh token success.' });
  }

  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('refreshToken');
    res.setHeader('Authorization', '');

    res.status(200).json({ message: 'logout success.' });
  }

  private setAuthHeadersAndCookies(
    res: Response,
    accessToken: string,
    refreshToken: Token,
  ) {
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: process.env.NODE_ENV === 'production',
    });
  }
}
