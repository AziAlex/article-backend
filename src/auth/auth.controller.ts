import { BadRequestException, Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express'
import { Cookies, UserAgent } from 'libs/common/src/decorators';
import { Token } from 'src/user/entitys.ts/token.entity';
import { VerifyCodeDto } from './dto/verify-code';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entitys.ts/user.entity';
import { UserService } from 'src/user/user.service';
import { VerifiedUser } from 'src/user/entitys.ts/verified-user.entity';
import { Repository } from 'typeorm';
import { add } from 'date-fns';

@ApiTags("Authorization")
@Controller('auth')
export class AuthController {

    constructor(private authService : AuthService,
        @InjectRepository(User)
        private readonly userService: UserService,
        @InjectRepository(VerifiedUser)
        private readonly verifiedRepository: Repository<VerifiedUser>,
    ) {}

    @Post("login")
    async login(@Body() userDto:GetUserDto, @UserAgent() userAgent:string,@Res() res: Response ){
        const { accessToken, refreshToken } = await this.authService.login(userDto, userAgent)
        this.setAuthHeadersAndCookies(res, accessToken, refreshToken)
        return res.status(200).json({ message: 'login success.' })
    }

    @Post("registration")
    async registration(@Body() userDto:GetUserDto){
        const { mail, id } =  await this.authService.registration(userDto)
        await this.verify(mail, id)
        return { message: 'register success.' }
    }

    @Post('refresh-token')
    async refreshTokens(@Res() res: Response, @Cookies("refreshToken") token: Token ){
        if (!token) {
            throw new BadRequestException('Refresh token not found.')
          }
          const { accessToken, refreshToken } = await this.authService.refreshTokens(token)
          this.setAuthHeadersAndCookies(res, accessToken, refreshToken)
          res.status(200).json({ message: 'refresh token success.' })
    }

  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('refreshToken')
    res.setHeader('Authorization', '')

    res.status(200).json({ message: 'logout success.' })
  }

  @Post('verify')
  async verifyCode(
    @Body() dto: VerifyCodeDto,
    @Res() res: Response,
    @UserAgent() userAgent: string,
  ) {
    const user = await this.userService.userByIdOrEmail(dto.email, true)
    const verified = await this.verifiedRepository.findOne({ where: { userId: user.id } })

    if (verified.code !== dto.code || verified.expiresAt < new Date()) {
      throw new BadRequestException('Verify code is not valid')
    }
    verified.verified = true
    await this.verifiedRepository.save(verified)
    const { accessToken, refreshToken } = await this.authService.generateTokens(user, userAgent)
    this.setAuthHeadersAndCookies(res, accessToken, refreshToken)
    return res.status(200).json({ message: 'verify success.' })
  }


  private setAuthHeadersAndCookies(res: Response, accessToken: string, refreshToken: Token) {
    res.setHeader('Authorization', `Bearer ${accessToken}`)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: process.env.NODE_ENV === 'production',
    })
  }

  private async verify(email: string, id: string) {
    const createCode = () => Math.floor(100000 + Math.random() * 900000)
    const code = createCode()

    const verified = await this.verifiedRepository.findOneBy({ userId: id })
    const updatedData = { code, expiresAt: add(new Date(), { minutes: 10 }) }

    // await this.emailService.sendMail({ email, code })
    if (verified) {
      await this.verifiedRepository.update({ userId: id }, updatedData)
    } else {
      this.verifiedRepository.save({ userId: id, ...updatedData }).catch(() => {
        throw new BadRequestException("Can't create verify code")
      })
    }
  }

  
}
