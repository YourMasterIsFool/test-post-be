import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { ResponseSuccessDTO } from 'src/global-dto/responseSuccessDTO';
import { customErrorExceptionResponse } from 'src/utils/customErrorExceptionResponse';

@Injectable()
export class CommentsService {
  constructor(private prismaService: PrismaService) {}
  async create(userId: number, schema: CreateCommentDto) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const created = await tx.comments.create({
          data: {
            comment: schema.comment,
            postId: schema.postId,
            userId: userId,
          },
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
    const data = await this.prismaService.comments.findMany({});

    return new ResponseSuccessDTO({
      data: data,
    });
  }

  async findOne(id: number) {
    const data = await this.prismaService.comments.findFirst({
      where: {
        id: id,
      },
    });

    return new ResponseSuccessDTO({
      data: data,
    });
  }

  async update(userId: number, id: number, schema: UpdateCommentDto) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const isUser = await tx.comments.findFirst({
          where: {
            id: id,
          },
          select: {
            userId: true,
          },
        });

        if (userId != isUser.userId) {
          throw new customErrorExceptionResponse(
            'Akses dilarang',
            HttpStatus.FORBIDDEN,
          );
        }
        const updated = await tx.comments.update({
          where: {
            id: id,
          },
          data: {
            comment: schema.comment,
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

  async remove(userId: number, id: number) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const isUser = await tx.comments.findFirst({
          where: {
            id: id,
          },
          select: {
            userId: true,
          },
        });

        if (userId != isUser.userId) {
          throw new customErrorExceptionResponse(
            'Akses dilarang',
            HttpStatus.FORBIDDEN,
          );
        }
        const findData = await tx.comments.findFirst({
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

        const removeData = await tx.comments.delete({
          where: {
            id: id,
          },
        });

        return new ResponseSuccessDTO({
          data: removeData.id,
          message: 'Successfully remove data',
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

  async liked(userId: number, id: number) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const findLiked = await tx.commentLikes.findFirst({
          where: {
            userId: userId,
            commentId: id,
          },
        });
        if (!findLiked) {
          await tx.commentLikes.create({
            data: {
              userId: userId,
              commentId: id,
            },
          });
        } else {
          await tx.commentLikes.delete({
            where: {
              id: findLiked.id,
            },
          });
        }

        return new ResponseSuccessDTO({
          data: null,
          message: 'Successfully update',
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

  async showLikes(commentId: number) {
    const data = await this.prismaService.commentLikes.findMany({
      where: {
        commentId: commentId,
      },
      select: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return new ResponseSuccessDTO({
      data: data,
      message: 'Successfully get data likes',
    });
  }
}
