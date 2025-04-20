import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {

  private readonly filePath = "./user.txt";

  private getUserList() {
    const userList = fs.readFileSync(path.join(__dirname, this.filePath), 'utf-8').trim()
      .split('\n').map((user) => {
      const [uuid, id, password] = user.split(',');
      return { uuid, id, password };
    });
    return userList;
  }

  create(createUserDto: CreateUserDto) {
    const uuid = crypto.randomUUID();
    console.log(__dirname, path.join(__dirname, this.filePath));
    fs.appendFileSync(path.join(__dirname, this.filePath), uuid + ',' + createUserDto.id + ',' + createUserDto.password + '\n');
    return uuid;
  }

  findOne(uuid: string) {
    const user = this.getUserList().find((user) => user.uuid === uuid);
    if (!user) {
      return null;
    }
    return {uuid: user.uuid, id: user.id};
  }

  update(uuid: string, updateUserDto: UpdateUserDto) {
    const userList = this.getUserList();
    const user = userList.find((user) => user.uuid === uuid);
    if (!user) {
      return null;
    }
    if (user.password !== updateUserDto.password) {
      throw new Error('Invalid password');
    }
    const updatedUserList = userList.map((user) => {
      if (user.uuid === uuid) {
        return { ...user, password: updateUserDto.newPassword };
      }
      return user;
    });
    console.log(updatedUserList);
    fs.writeFileSync(path.join(__dirname, this.filePath), updatedUserList.map((user) => user.uuid + ',' + user.id + ',' + user.password).join('\n') + '\n');
  }

  remove(uuid: string, password: string) {
    const userList = this.getUserList();
    const user = userList.find((user) => user.uuid === uuid);
    if (!user) {
      return null;
    }
    if (user.password !== password) {
      return { error: 'Invalid password' };
    }
    const updatedUserList = userList.filter((user) => user.uuid !== uuid);
    fs.writeFileSync(path.join(__dirname, this.filePath), updatedUserList.map((user) => user.uuid + ',' + user.id + ',' + user.password).join('\n') + '\n');
  }
}
