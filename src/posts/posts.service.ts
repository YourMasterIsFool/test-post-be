import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { customErrorExceptionResponse } from 'src/utils/customErrorExceptionResponse';
import { ResponseSuccessDTO } from 'src/global-dto/responseSuccessDTO';

import * as moment from 'moment';

@Injectable()
export class PostsService {
  constructor(private prismaService: PrismaService) {}
  async create(userId: number, schema: CreatePostDto) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const created = await tx.posts.create({
          data: {
            title: schema.title,
            context: schema.context,
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

  async findAll(userId: number) {
    const data = await this.prismaService.posts.findMany({
      orderBy: {
        id: 'desc',
      },
      include: {
        _count: {
          select: {
            PostLike: true,
            Comments: true,
          },
        },

        PostLike: {
          where: {
            userId: userId,
          },
          select: {
            id: true,
            createdAt: true,
          },
        },
        user: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    const postsIsLiked = data.map((item) => {
      return {
        likedCount: item._count.PostLike,
        commentsCount: item._count.Comments,
        id: item.id,
        title: item.title,
        context: item.context,
        canEdit: item.user.id == userId ? true : false,
        canDelete: item.userId == userId ? true : false,
        creatorName: item.user.name,
        createdAt: moment(item.createdAt).format('DD/MM/YYYY hh:mm:ss'),
        isLiked: item.PostLike.length > 0,
      };
    });

    return new ResponseSuccessDTO({
      data: postsIsLiked,
    });
  }

  async findOne(id: number) {
    const data = await this.prismaService.posts.findFirst({
      where: {
        id: id,
      },
    });

    return new ResponseSuccessDTO({
      data: data,
    });
  }

  async update(userId: number, id: number, updateTagDto: UpdatePostDto) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const isUser = await tx.posts.findFirst({
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
        const updated = await tx.posts.update({
          where: {
            id: id,
          },
          data: {
            title: updateTagDto.title,
            context: updateTagDto.context,
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
        const isUser = await tx.posts.findFirst({
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
        const findData = await tx.posts.findFirst({
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

        const removeData = await tx.posts.delete({
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
        const findLiked = await tx.postLikes.findFirst({
          where: {
            userId: userId,
            postId: id,
          },
        });
        if (!findLiked) {
          await tx.postLikes.create({
            data: {
              userId: userId,
              postId: id,
            },
          });
        } else {
          await tx.postLikes.delete({
            where: {
              id: findLiked.id,
            },
          });
        }

        const dataLike = await tx.postLikes.count({
          where: {
            postId: id,
          },
        });

        const isLike = await tx.postLikes.findFirst({
          where: {
            postId: id,
            userId: userId,
          },
        });

        const context = {
          count: dataLike,
          isLiked: isLike ? true : false,
        };
        return new ResponseSuccessDTO({
          data: context,
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

  async showLikes(postId: number) {
    const data = await this.prismaService.postLikes.findMany({
      where: {
        postId: postId,
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

  async showCommentByPostId(postId: number) {
    const data = await this.prismaService.posts.findFirst({
      where: {
        id: postId,
      },
      include: {
        Comments: {
          include: {
            user: true,
          },
        },
        user: true,
      },
    });

    return new ResponseSuccessDTO({
      data: data,
      message: 'Successfully get data likes',
    });
  }
}
