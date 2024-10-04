import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GetUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entitys.ts/user.entity';
import { compare, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { Token } from 'src/user/entitys.ts/token.entity';
import { v4 } from 'uuid';
import { add } from "date-fns/add"

@Injectable()
export class AuthService {

    constructor(private readonly tokenRepository: Repository<Token>, private userService: UserService, private jwtService: JwtService) { }

    async registration(userDto: GetUserDto) {
        const candidate = await this.userService.userByIdOrEmail(userDto.mail);
        if (candidate) {
            throw new HttpException('Пользователь с таким mail существует', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await hash(userDto.password, 10);
        const user = await this.userService.createUser({ ...userDto, password: hashPassword })
        return user
    }


    async login(userDto: GetUserDto, userAgent: string) {
        const user = await this.validateUser(userDto)
        return this.generateTokens(user, userAgent);
    }


    public async refreshTokens(refreshToken: Token) {
        if (!refreshToken || refreshToken.expiresAt < new Date()) {
          throw new BadRequestException('Refresh token expired')
        }
    
        const user = await this.userService.userByIdOrEmail(refreshToken.id)
        return this.generateTokens(user, refreshToken.userAgent)
      }


    public async generateTokens(user: User, userAgent) {
        const payload = { id: user.id }
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = await this.saveOrUpdateRefreshToken(user.id, userAgent)
        return {
            accessToken,
            refreshToken,
        };
    }

    private async saveOrUpdateRefreshToken(id: string, userAgent: string) {
        const existingToken = await this.tokenRepository.findOne({
            where: {
                id: id,
                userAgent: userAgent
            }
        });

        if (existingToken) {
            await this.tokenRepository.delete({ userAgent: userAgent, id: id })
        }

        return await this.tokenRepository.save({
            token: v4(),
            expiresAt: add(new Date(), { months: 1 }),
            id: id,
            userAgent: userAgent
        })
    }

    private async validateUser(userDto: GetUserDto) {
        const user = await this.userService.userByIdOrEmail(userDto.mail, true);
        const passwordEquals = await compare(userDto.password, user.password)
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({ message: 'Некорректный емайл или пароль' })
    }



    async refresh(refreshToken: string) { }

}
