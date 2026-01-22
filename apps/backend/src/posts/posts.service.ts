import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { PaginationDto } from 'src/dto/pagination.dto';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
      },
    });
  }

  async findAll(page?: number, pageSize?: number): Promise<PaginationDto<Post>> {
    const hasPagination = page !== -1 && pageSize !== -1;
    const posts = this.prisma.post.findMany({
      skip: hasPagination ? (page - 1) * pageSize : undefined,
      take: hasPagination ? pageSize : undefined,
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });

    const count = this.prisma.post.count();

    try {
      const [postsa, counta] = await Promise.all([posts, count]);
      const limit = hasPagination ? Math.floor(counta / pageSize) : 0;
      return {
        data: postsa,
        count: counta,
        page,
        limit,
      };
    } catch {
      throw new InternalServerErrorException('An error occurred.');
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.post.findUniqueOrThrow({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(`This post doesn't exist.`);
        }
        throw new InternalServerErrorException('An error occurred.');
      }
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      return await this.prisma.post.update({
        where: {
          id,
        },
        data: {
          ...updatePostDto,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(`This post doesn't exist.`);
        }
        throw new InternalServerErrorException('An error occurred.');
      }
    }
  }

  remove(id: number) {
    try {
      return this.prisma.post.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(`This post doesn't exist.`);
        }
        throw new InternalServerErrorException('An error occurred.');
      }
    }
  }

  async togglePin(id: number) {
    try {
      const post = await this.prisma.post.findUniqueOrThrow({ where: { id } });
      return await this.prisma.post.update({
        where: { id },
        data: { isPinned: !post.isPinned },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(`This post doesn't exist.`);
        }
        throw new InternalServerErrorException('An error occurred.');
      }
    }
  }
}
