import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';

@ApiTags("Authorization")
@Controller('auth')
export class AuthController {

    constructor(private authService : AuthService) {}

    @Post("login")
    login(@Body() userDto:GetUserDto){
        return this.authService.login(userDto)
    }

    
    @Post("registration")
    registration(@Body() userDto:GetUserDto){
        return this.authService.registration(userDto)
    }

    @Post('refresh')
     refresh(@Body('refreshToken') refreshToken: string) {
        return this.authService.refresh(refreshToken);
    }
}
