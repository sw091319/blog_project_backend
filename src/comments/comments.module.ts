import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [PrismaModule, forwardRef(() => UsersModule)],
  exports: [CommentsService],
})
export class CommentsModule {}
