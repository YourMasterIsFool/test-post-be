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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWtGuard } from 'src/jwt/jwt-guard';
import { RoleGuard } from 'src/jwt/role-guard';
import { ResponseSuccessDTO } from 'src/global-dto/responseSuccessDTO';

@Controller('/api/comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post()
  @UseGuards(JWtGuard, RoleGuard)
  @ApiBearerAuth()
  async create(@Req() req, @Body() schema: CreateCommentDto) {
    console.log(req);
    return await this.commentService.create(req.user.id, schema);
  }

  @UseGuards(JWtGuard, RoleGuard)
  @ApiBearerAuth()
  @Get('/list')
  findAll() {
    return this.commentService.findAll();
  }

  @UseGuards(JWtGuard, RoleGuard)
  @ApiBearerAuth()
  @Get('/detail/:id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }
  @UseGuards(JWtGuard, RoleGuard)
  @ApiBearerAuth()
  @Patch('/update/:id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() schema: UpdateCommentDto,
  ) {
    return await this.commentService.update(req.user.id, +id, schema);
  }

  @UseGuards(JWtGuard, RoleGuard)
  @ApiBearerAuth()
  @Delete('/remove/:id')
  async remove(@Req() req, @Param('id') id: string) {
    return await this.commentService.remove(req.user.id, +id);
  }

  @UseGuards(JWtGuard, RoleGuard)
  @ApiBearerAuth()
  @Post('/detail/:id/liked')
  async like(@Req() req, @Param('id') id: string) {
    return await this.commentService.remove(req.user.id, +id);
  }

  @UseGuards(JWtGuard, RoleGuard)
  @ApiBearerAuth()
  @Get('/detail/:id/show-likes')
  async showLikes(
    @Req() req,
    @Param('id') id: string,
  ): Promise<ResponseSuccessDTO<any>> {
    return await this.commentService.showLikes(+id);
  }
}
