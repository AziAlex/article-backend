import { IsEmail, IsNumber, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class VerifyCodeDto {
  @ApiProperty({ default: 'alex.dev@gmail.com', description: 'Email' })
  @IsEmail()
  email: string

  @ApiProperty({ default: 253638, description: 'Code' })
  @IsNumber()
  @Length(6, 6)
  code: number
}