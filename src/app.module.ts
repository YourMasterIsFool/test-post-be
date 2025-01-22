import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './service/prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { constant } from './constant';
import { JwtStrategy } from './jwt/jwt.strategy';
import { chownSync } from 'fs';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TagsModule } from './tags/tags.module';
import { RoleGuard } from './jwt/role-guard';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, PassportModule, TagsModule, PostsModule, CommentsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtStrategy, RoleGuard],
})
export class AppModule {}
