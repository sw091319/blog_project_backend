import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(private readonly prisma : PrismaService) {};

  async create(createUserDto: CreateUserDto) {
    const result = await this.prisma.users.create({
      data: {
        id: createUserDto.id,
        password: createUserDto.password,
      },
    });
    console.log(result);
    return result.uuid;
  }

  async findOne(uuid: string) {
    const user = await this.prisma.users.findUnique({
      where: { uuid },
    });
    if(!user || user.deletedAt) {
      throw new UnauthorizedException('User not found');
    }
    return {uuid: user.uuid, id: user.id};
  }

  async update(uuid: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.users.findUnique({
      where: { uuid },
    });
    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Invalid userid or password');
    }
    if (user.password !== updateUserDto.password) {
      throw new UnauthorizedException('Invalid userid or password');
    }
    await this.prisma.users.update({
      where: { uuid },
      data: {
        password: updateUserDto.newPassword,
      },
    });
  }

  async remove(uuid: string, password: string) {
    const user = await this.prisma.users.findUnique({
      where: { uuid },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid userid or password');
    }
    if (user.password !== password) {
      throw new UnauthorizedException('Invalid userid or password');
    }
    if (user.deletedAt) {
      throw new ConflictException('User already deleted');
    }
    await this.prisma.users.update({
      where: { uuid },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
