import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Req, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.id || !createUserDto.password) {
      return { error: 'Missing id or password' };
    }
    const uuid = this.usersService.create(createUserDto);
    return {
      uuid: uuid
    };
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    const user = this.usersService.findOne(uuid);
    return user ? user : { error: 'User not found' };
  }

  @Patch(':uuid')
  @HttpCode(204)
  update(@Param('uuid') uuid: string, @Body() updateUserDto: UpdateUserDto) {
    this.usersService.update(uuid, updateUserDto);
  }

  @Delete(':uuid')
  @HttpCode(204)
  remove(@Param('uuid') uuid: string, @Query('password') password: string) {
    this.usersService.remove(uuid, password);
  }
}
