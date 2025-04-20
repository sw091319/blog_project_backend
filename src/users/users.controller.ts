import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Req, Query, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.id || !createUserDto.password) {
      return { error: 'Missing id or password' };
    }
    const uuid = await this.usersService.create(createUserDto);
    console.log(uuid);
    return {
      uuid
    };
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    const user = await this.usersService.findOne(uuid);
    return user;
  }

  @Patch(':uuid')
  @HttpCode(204)
  async update(@Param('uuid') uuid: string, @Body() updateUserDto: UpdateUserDto) {
    await this.usersService.update(uuid, updateUserDto);
  }

  @Delete(':uuid')
  @HttpCode(204)
  async remove(@Param('uuid') uuid: string, @Query('password') password: string) {
    await this.usersService.remove(uuid, password);
  }
}
