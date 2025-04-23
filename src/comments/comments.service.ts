import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { stringify } from 'querystring';
import { create } from 'domain';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private userService: UsersService,
  ) {}

  async create(
    uuid: string,
    password: string,
    postId: string,
    createCommentDto: CreateCommentDto,
  ) {
    await this.userService.getUser(uuid, password);
    const result = await this.prisma.comments.create({
      data: {
        contents: createCommentDto.contents,
        postId: postId,
        userId: uuid,
      },
    });
    return result;
  }

  async findCommentList(postId: string) {
    const commentList = await this.prisma.comments.findMany({
      where: { postId: postId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
    return {
      commentList: commentList.map((comment) => {
        return {
          uuid: comment.userId,
          id: comment.author.id,
          contents: comment.contents,
        };
      }),
    };
  }

  async findUserCommentList(uuid: string) {
    const CommentList = await this.prisma.comments.findMany({
      where: { userId: uuid, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { post: true },
    });

    return {
      myCommnts: CommentList.map((comment) => {
        return {
          post: {
            postId: comment.post.id,
            title: comment.post.title,
          },
          commentId: comment.id,
          contents: comment.contents,
          createdAt: comment.createdAt,
        };
      }),
    };
  }
  async update(
    commentId: string,
    uuid: string,
    password: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    await this.userService.getUser(uuid, password);
    const comment = await this.prisma.comments.findUnique({
      where: { id: commentId },
    });
    if (!comment || comment.deletedAt) {
      throw new NotFoundException('Comment not found');
    }
    await this.prisma.comments.update({
      where: { id: commentId },
      data: {
        contents: updateCommentDto.contents,
      },
    });
  }

  async remove(commentId: string, uuid: string, password: string) {
    await this.userService.getUser(uuid, password);
    const comment = await this.prisma.comments.findUnique({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.deletedAt) {
      throw new ConflictException('Comment already deleted');
    }
    await this.prisma.comments.update({
      where: { id: commentId },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
