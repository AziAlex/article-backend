import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class GetUserDto {
  @ApiProperty({ example: '31d6c6b4-9280-4071-9ba0-958ded6b8f22' })
  id: string;
  @ApiProperty({ example: 'islamgasanov532@gmail.com', description: 'Почта' })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Некорректный mail' })
  mail: string;
  @ApiProperty({ example: '12345', description: 'Пароль' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(8, 16, { message: 'Не меньше 8 и не больше 16' })
  password: string;
  @ApiProperty({ example: false })
  verified: boolean;
  @ApiProperty({ example: '2024-02-11T21:44:34.040Z' })
  createdAt: Date;
  @ApiProperty({ example: '2024-02-11T21:44:34.040Z' })
  updatedAt: Date;
}
