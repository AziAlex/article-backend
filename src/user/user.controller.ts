import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }


  @ApiOperation({ summary: 'Get users' })
  @ApiResponse({ status: 202, type: GetUserDto })
  @Get()
  getAll() {
    return this.userService.allUsers();
  }

  @ApiOperation({ summary: 'Get user by id or email' })
  @ApiResponse({ status: 202, type: GetUserDto })
  @Get(':idOrEmail')
  findOne(@Param('idOrEmail') idOrEmail: string) {
    return this.userService.userByIdOrEmail(idOrEmail)
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 204 })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.delleteUserById(id);
  }
}
