import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entitys.ts/user.entity';
import { Token } from './entitys.ts/token.entity';
import { VerifiedUser } from './entitys.ts/verified-user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule, UserModule],
  imports: [
    TypeOrmModule.forFeature([User, Token, VerifiedUser]),
    forwardRef(() => AuthModule),
  ],
})
export class UserModule {}
