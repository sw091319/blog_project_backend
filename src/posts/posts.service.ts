import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { title } from 'process';

@Injectable()
export class PostsService {

  async checkUser(uuid: string, password: string) {
    const user = await this.prisma.users.findUnique({
      where: { uuid },
    });
    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Invalid userid or password');
    }
    if (user.password !== password) {
      throw new UnauthorizedException('Invalid userid or password');
    }
  }
  
  constructor(private readonly prisma: PrismaService) {};

  async create(uuid: string, password : string ,createPostDto: CreatePostDto) {
    this.checkUser(uuid, password);
    const result = await this.prisma.posts.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.contents,
        userId: uuid,
      },
    });

    return result.id;
  }

  async findOne(postId: string) {
    const post = await this.prisma.posts.findUnique({
      where: { id: postId },
    });
    if (!post || post.deletedAt) {
      throw new UnauthorizedException('Post not found');
    }

    const user = await this.prisma.users.findUnique({
      where: { uuid: post.userId },
    });
    if (!user || user.deletedAt) {
      throw new UnauthorizedException('User not found');
    }
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      title: post.title,
      contents: post.content,
      author : {
        uuid : post.userId,
        id : user.id,
      }
    }

  }

  async findAll() {
    const posts = await this.prisma.posts.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return {
      posts: posts.map((post) => {
        return {
          uuid :post.userId,
          title: post.title,
          contents: post.content,
        };
      }),
    };
  }

  async put(postId : string, uuid: string, password: string, createPostDto: CreatePostDto) {
    this.checkUser(uuid, password);
    const post = await this.prisma.posts.findUnique({
      where: { id: postId },
    });
    if (!post || post.deletedAt) {
      throw new UnauthorizedException('Post not found');
    }
    await this.prisma.posts.update({
      where: { id: postId },
      data: {
        title: createPostDto.title,
        content: createPostDto.contents,
      },
    });
  }

  async remove(postId : string, uuid: string, password: string) {
    this.checkUser(uuid, password);
    const post = await this.prisma.posts.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new UnauthorizedException('Post not found');
    }
    if (post.deletedAt) {
      throw new ConflictException('Post already deleted');
    }
    await this.prisma.posts.update({
      where: { id: postId },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
