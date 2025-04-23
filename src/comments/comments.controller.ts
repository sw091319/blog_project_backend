import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Body('uuid') uuid: string,
    @Body('password') password: string,
    @Body('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(
      uuid,
      password,
      postId,
      createCommentDto,
    );
  }

  @Get()
  findCommentList(@Query('postId') postId: string) {
    return this.commentsService.findCommentList(postId);
  }

  @Patch(':commentId')
  @HttpCode(204)
  async update(
    @Param('commentId') commentId: string,
    @Body('uuid') uuid: string,
    @Body('password') password: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(
      commentId,
      uuid,
      password,
      updateCommentDto,
    );
  }

  @Delete(':commentId')
  @HttpCode(204)
  async remove(
    @Param('commentId') commentId: string,
    @Query('uuid') uuid: string,
    @Query('password') password: string,
  ) {
    await this.commentsService.remove(commentId, uuid, password);
  }
}
