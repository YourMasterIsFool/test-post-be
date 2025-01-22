import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { customErrorExceptionResponse } from 'src/utils/customErrorExceptionResponse';
import { ResponseSuccessDTO } from 'src/global-dto/responseSuccessDTO';

@Injectable()
export class TagsService {
  constructor(private prismaService: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const checkTagsIfExits = await tx.tags.findFirst({
          where: {
            name: createTagDto.name,
          },
        });

        if (checkTagsIfExits) {
          throw new customErrorExceptionResponse(null, HttpStatus.BAD_REQUEST, {
            name: 'Tag sudah dibuat',
          });
        }

        const created = await tx.tags.create({
          data: createTagDto,
        });

        return new ResponseSuccessDTO({
          data: created,
        });
      });
    } catch (e) {
      if (e instanceof customErrorExceptionResponse) {
        throw e;
      }

      throw new customErrorExceptionResponse(
        'Error internal server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    const data = await this.prismaService.tags.findMany({});

    return new ResponseSuccessDTO({
      data: data,
    });
  }

  async findOne(id: number) {
    const data = await this.prismaService.tags.findFirst({
      where: {
        id: id,
      },
    });

    return new ResponseSuccessDTO({
      data: data,
    });
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const updated = await tx.tags.update({
          where: {
            id: id,
          },
          data: {
            name: updateTagDto.name,
          },
        });

        return updated;
      });
    } catch (e) {
      if (e instanceof customErrorExceptionResponse) {
        throw e;
      }

      throw new customErrorExceptionResponse(
        'Error internal server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const findData = await tx.tags.findFirst({
          where: {
            id: id,
          },
        });

        if (!findData) {
          throw new customErrorExceptionResponse(
            'Data not found',
            HttpStatus.NOT_FOUND,
          );
        }
      });
    } catch (e) {
      if (e instanceof customErrorExceptionResponse) {
        throw e;
      }

      throw new customErrorExceptionResponse(
        'Error internal server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
