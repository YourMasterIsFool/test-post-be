import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseSuccessDTO } from 'src/global-dto/responseSuccessDTO';
import { JWtGuard } from 'src/jwt/jwt-guard';
import { RoleGuard } from 'src/jwt/role-guard';
import { RolesDecorator } from 'src/jwt/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get('/list')
  @HttpCode(200)
  @UseGuards(JWtGuard, RoleGuard)
  @RolesDecorator('admin')
  @ApiBearerAuth()
  @HttpCode(200)
  async findAll(): Promise<ResponseSuccessDTO<any>> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
