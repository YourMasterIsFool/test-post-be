import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ResponseSuccessDTO } from 'src/global-dto/responseSuccessDTO';
import { JWtGuard } from 'src/jwt/jwt-guard';
import { RoleGuard } from 'src/jwt/role-guard';
import { RolesDecorator } from 'src/jwt/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('/api/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JWtGuard, RoleGuard)
  @RolesDecorator('admin')
  @ApiBearerAuth()
  async create(
    @Body() createTagDto: CreateTagDto,
  ): Promise<ResponseSuccessDTO<any>> {
    return await this.tagsService.create(createTagDto);
  }

  @Get()
  async findAll() {
    return await this.tagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(+id);
  }

  @HttpCode(201)
  @RolesDecorator('admin')
  @UseGuards(JWtGuard, RoleGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(+id, updateTagDto);
  }

  @HttpCode(201)
  @UseGuards(JWtGuard, RoleGuard)
  @RolesDecorator('admin')
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}
