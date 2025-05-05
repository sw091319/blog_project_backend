import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Req,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
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
    return {
      uuid,
    };
  }

  @Get('login')
  async login(@Query('id') id: string, @Query('password') password: string) {
    console.log(id, password);
    if (!id || !password) {
      throw new BadRequestException('Missing id or password');
    }
    const user = await this.usersService.login(id, password);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get(':uuid')
  async showUser(
    @Param('uuid') uuid: string,
    @Query('password') password: string,
  ) {
    const user = await this.usersService.showUser(uuid, password);
    return user;
  }

  @Patch(':uuid')
  @HttpCode(204)
  async update(
    @Param('uuid') uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.usersService.update(uuid, updateUserDto);
  }

  @Delete(':uuid')
  @HttpCode(204)
  async remove(
    @Param('uuid') uuid: string,
    @Query('password') password: string,
  ) {
    await this.usersService.remove(uuid, password);
  }
}
