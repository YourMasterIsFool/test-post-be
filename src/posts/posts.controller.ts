import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JWtGuard } from 'src/jwt/jwt-guard';
import { RoleGuard } from 'src/jwt/role-guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('/api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JWtGuard, RoleGuard)
  @ApiBearerAuth()
  async create(@Req() req, @Body() createPostDto: CreatePostDto) {
    console.log(req);
    return await this.postsService.create(req.user.id, createPostDto);
  }

  @UseGuards(JWtGuard, RoleGuard)
  @ApiBearerAuth()
  @Get('/list')
  findAll(@Req() req) {
    return this.postsService.findAll(req.user.id);
  }

  @UseGuards(JWtGuard, RoleGuard)
  @ApiBearerAuth()
  @Get('/detail/:id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }
  @UseGuards(JWtGuard, RoleGuard)
  @ApiBearerAuth()
  @Patch('/update/:id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postsService.update(req.user.id, +id, updatePostDto);
  }

  @UseGuards(JWtGuard, RoleGuard)
  @ApiBearerAuth()
  @Delete('/remove/:id')
  async remove(@Req() req, @Param('id') id: string) {
    return await this.postsService.remove(req.user.id, +id);
  }

  @UseGuards(JWtGuard, RoleGuard)
  @ApiBearerAuth()
  @Post('/detail/:id/liked')
  async liked(@Req() req, @Param('id') id: string) {
    return await this.postsService.liked(req.user.id, +id);
  }

  @UseGuards(JWtGuard, RoleGuard)
  @ApiBearerAuth()
  @Get('/detail/:id/show-likes')
  async showLikes(@Req() req, @Param('id') id: string) {
    return await this.postsService.showLikes(+id);
  }

  @UseGuards(JWtGuard, RoleGuard)
  @ApiBearerAuth()
  @Get('/detail/:id/show-comments')
  async showComments(@Req() req, @Param('id') id: string) {
    return await this.postsService.showCommentByPostId(+id);
  }
}
