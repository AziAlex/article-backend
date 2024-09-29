import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entites.ts/article.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Article])],
})

export class UserModule { }
