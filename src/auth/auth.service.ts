import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { hashedPassword } from 'src/utils/hashedPassword';
import { customErrorExceptionResponse } from 'src/utils/customErrorExceptionResponse';
import { plainToClass } from 'class-transformer';
import { UserDTO } from './dto/user-dto';
import { LoginAuthDTO } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async create(createAuthDto: CreateAuthDto) {}

  async login(schema: LoginAuthDTO) {
    const checkUser = await this.prismaService.user.findFirst({
      where: {
        username: schema.username,
      },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log(schema.username);
    if (!checkUser) {
      throw new customErrorExceptionResponse(
        'username tidak ada',
        HttpStatus.BAD_REQUEST,
        {
          username: 'Username tidak ada',
        },
      );
    }

    const passwordIsMatch = await bcrypt.compare(
      schema.password,
      checkUser.password,
    );
    if (!passwordIsMatch) {
      throw new customErrorExceptionResponse(
        'Password tidak sesuai',
        HttpStatus.BAD_REQUEST,
        {
          password: 'Password tidak sesuai',
        },
      );
    }

    const sub = {
      id: checkUser.id,
      username: checkUser.username,
      name: checkUser.name,
      role: checkUser.role.name,
    };

    return {
      access_token: this.jwtService.sign(sub),
    };
  }

  async findAll() {
    const data = await this.prismaService.user.findMany({
      select: {
        name: true,
        id: true,
        username: true,
      },
    });

    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async register(schema: CreateAuthDto) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const password = await hashedPassword(schema.password);
        const checkUsername = await tx.user.findFirst({
          where: {
            username: schema.username,
          },
        });

        console.log(checkUsername);
        if (checkUsername) {
          throw new customErrorExceptionResponse(
            'Username telah digunakan',
            HttpStatus.BAD_REQUEST,
            {
              username: 'Username telah digunakan',
            },
          );
        }
        const created = await tx.user.create({
          data: {
            name: schema.name,
            username: schema.username,
            password: password,
            roleId: schema.roleId ?? 2,
          },
        });
        console.log('console', created);
        const plain = plainToClass(UserDTO, created, {
          excludeExtraneousValues: true,
        });
        console.log(plain);
        return plainToClass(UserDTO, created, {
          excludeExtraneousValues: true,
        });
      });
    } catch (e) {
      if (e instanceof customErrorExceptionResponse) {
        throw e;
      }

      throw new customErrorExceptionResponse(
        e,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
