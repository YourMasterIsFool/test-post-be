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
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ResponseSuccessDTO } from 'src/global-dto/responseSuccessDTO';
import { AuthGuard } from '@nestjs/passport';
import { JWtGuard } from 'src/jwt/jwt-guard';
import { RoleGuard } from 'src/jwt/role-guard';
import { RolesDecorator } from 'src/jwt/roles.decorator';
import { LoginAuthDTO } from './dto/login-auth.dto';
import { UserDTO } from './dto/user-dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/create')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('/login')
  async login(@Body() schema: LoginAuthDTO) {
    return this.authService.login(schema);
  }

  @Post('/register/')
  async registerV1(
    @Body() schema: CreateAuthDto,
  ): Promise<ResponseSuccessDTO<UserDTO>> {
    const data = await this.authService.register(schema);

    console.log('heh');
    return new ResponseSuccessDTO<UserDTO>({
      data: data,
      message: 'Successfully created data',
    });
  }

  @Get()
  @UseGuards(JWtGuard, RoleGuard)
  @RolesDecorator('admin')
  @HttpCode(200)
  async findAll(): Promise<ResponseSuccessDTO<any>> {
    const data = await this.authService.findAll();
    return new ResponseSuccessDTO({
      data: data,
      statusCode: 200,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
