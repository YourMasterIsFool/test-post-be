import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/service/prisma/prisma.service';
import * as moment from 'moment';
import { ResponseSuccessDTO } from 'src/global-dto/responseSuccessDTO';
@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  // create(createUserDto: CreateUserDto) {
  //     return 'This action adds a new user';
  //   }

  async findAll() {
    const data = await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            Posts: true,
          },
        },
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    const mappingData = data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        totalPost: item._count.Posts,
        role: item.role.name,
        createdAt: moment(item.createdAt).format('DD/MM/YYYY hh:mm:ss'),
      };
    });

    return new ResponseSuccessDTO({
      data: mappingData,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
