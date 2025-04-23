import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async create(uuid: string, password: string, createPostDto: CreatePostDto) {
    await this.userService.getUser(uuid, password);
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
      include: {
        author: true,
      },
    });
    if (!post || post.deletedAt) {
      throw new NotFoundException('Post not found');
    }

    return {
      title: post.title,
      contents: post.content,
      author: {
        uuid: post.userId,
        id: post.author.id,
      },
    };
  }

  async findAll() {
    const posts = await this.prisma.posts.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
      },
    });
    return {
      posts: posts.map((post) => ({
        uuid: post.userId,
        id: post.author.id,
        title: post.title,
        contents: post.content,
      })),
    };
  }

  async findUserPostList(uuid: string) {
    const postList = await this.prisma.posts.findMany({
      where: { userId: uuid, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return {
      myPosts: postList.map((post) => ({
        postId: post.id,
        title: post.title,
        createdAt: post.createdAt,
      })),
    };
  }

  async update(
    postId: string,
    uuid: string,
    password: string,
    updatePostDto: UpdatePostDto,
  ) {
    await this.userService.getUser(uuid, password);
    const post = await this.prisma.posts.findUnique({
      where: { id: postId },
    });
    if (!post || post.deletedAt) {
      throw new NotFoundException('Post not found');
    }
    await this.prisma.posts.update({
      where: { id: postId },
      data: {
        title: updatePostDto.title,
        content: updatePostDto.contents,
      },
    });
  }

  async remove(postId: string, uuid: string, password: string) {
    await this.userService.getUser(uuid, password);
    const post = await this.prisma.posts.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
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
