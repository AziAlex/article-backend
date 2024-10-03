import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GetUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entitys.ts/user.entity';
import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(private userService: UserService, private jwtService: JwtService) { }

    async login(userDto: GetUserDto) {
        const user = await this.validateUser(userDto)
        return this.generateTokens(user);
    }


    async registration(userDto: GetUserDto) {
        const candidate = await this.userService.userByIdOrEmail(userDto.mail);
        if (candidate) {
            throw new HttpException('Пользователь с таким mail существует', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await hash(userDto.password, 10);
        const user = await this.userService.createUser({ ...userDto, password: hashPassword })
        return this.generateTokens(user)
    }

    private async generateTokens(user: User) {
        const payload = { id: user.id }
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        return {
            accessToken,
            refreshToken,
        };
    }

    private async validateUser(userDto: GetUserDto) {
        const user = await this.userService.userByIdOrEmail(userDto.mail, true);
        const passwordEquals = await compare(userDto.password, user.password)
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({ message: 'Некорректный емайл или пароль' })
    }



    async refresh(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.userService.userByIdOrEmail(payload.id);

            if (!user) {
                throw new UnauthorizedException({ message: 'Пользователь не найден' });
            }

            return this.generateTokens(user);
        } catch (error) {
            throw new UnauthorizedException({ message: 'Недействительный токен' });
        }
    }
}
