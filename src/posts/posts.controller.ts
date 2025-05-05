import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpCode,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(
    @Body('uuid') uuid: string,
    @Body('password') password: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    const postId = await this.postsService.create(
      uuid,
      password,
      createPostDto,
    );
    return { postId };
  }

  @Get()
  async findAll() {
    const posts = await this.postsService.findAll();
    return posts;
  }

  @Get(':postId')
  async findOne(@Param('postId') postId: string) {
    const post = await this.postsService.findOne(postId);
    return post;
  }

  @Put(':postId')
  @HttpCode(204)
  async update(
    @Param('postId') postId: string,
    @Body('uuid') uuid: string,
    @Body('password') password: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    await this.postsService.update(postId, uuid, password, updatePostDto);
  }

  @Delete(':postId')
  @HttpCode(204)
  async remove(
    @Param('postId') postId: string,
    @Body('uuid') uuid: string,
    @Body('password') password: string,
  ) {
    await this.postsService.remove(postId, uuid, password);
  }
}
