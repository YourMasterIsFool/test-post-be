import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/service/prisma/prisma.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // mengambil data rrole contoh "admin"

    console.log('handler', this.reflector);
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    console.log(roles);
    if (!roles) {
      return true;
    }

    // memngabil data user from http authorization
    const request = context.switchToHttp().getRequest();

    const { id } = request.user;

    const role = this.prismaService.user.findFirst({
      where: {
        id: id,
      },
      select: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    return roles.some((roleSome) => roleSome.includes(role.role.name));
  }
}
