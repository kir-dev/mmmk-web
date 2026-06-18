import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { PaginationDto } from '../dto/pagination.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto) {
    // Create the comment and purge overlapping reservations atomically, so a failure
    // in the deletion step doesn't leave a committed comment behind.
    return this.prisma.$transaction(async (tx) => {
      const comment = await tx.comment.create({
        data: {
          ...createCommentDto,
        },
      });

      // If the new comment blocks reservations, delete any that overlap its window
      if (!createCommentDto.isReservable) {
        await this.deleteOverlappingReservations(
          new Date(createCommentDto.startTime),
          new Date(createCommentDto.endTime),
          tx
        );
      }

      return comment;
    });
  }

  findAll(page?: number, pageSize?: number): Promise<PaginationDto<Comment>> {
    const hasPagination = page !== -1 && pageSize !== -1;
    const comments = this.prisma.comment.findMany({
      skip: hasPagination ? (page - 1) * pageSize : undefined,
      take: hasPagination ? pageSize : undefined,
      orderBy: {
        startTime: 'asc',
      },
    });

    const count = this.prisma.reservation.count();

    return Promise.all([comments, count])
      .then(([comments, count]) => {
        const limit = hasPagination ? Math.floor(count / pageSize) : 0;
        return {
          data: comments,
          count,
          page,
          limit,
        };
      })
      .catch(() => {
        throw new InternalServerErrorException('An error occurred.');
      });
  }

  async findOne(id: number) {
    try {
      return await this.prisma.comment.findUniqueOrThrow({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(`This comment doesn't exist.`);
        }
        throw new InternalServerErrorException('An error occurred.');
      }
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    try {
      // Update the comment and purge overlapping reservations atomically.
      return await this.prisma.$transaction(async (tx) => {
        const updated = await tx.comment.update({
          where: {
            id,
          },
          data: {
            ...updateCommentDto,
          },
        });

        // If the updated comment now blocks reservations, purge any overlapping ones
        if (updated.isReservable === false) {
          await this.deleteOverlappingReservations(new Date(updated.startTime), new Date(updated.endTime), tx);
        }

        return updated;
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(`This comment doesn't exist.`);
        }
        throw new InternalServerErrorException('An error occurred.');
      }
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.comment.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(`This comment doesn't exist.`);
        }
        throw new InternalServerErrorException('An error occurred.');
      }
    }
  }

  /**
   * Deletes all reservations whose time window overlaps with [startTime, endTime].
   * Called automatically when a non-reservable comment is created or updated.
   * A reservation overlaps if it starts before the window ends AND ends after the window starts.
   *
   * @returns the number of reservations deleted
   */
  async deleteOverlappingReservations(
    startTime: Date,
    endTime: Date,
    client: Prisma.TransactionClient = this.prisma
  ): Promise<number> {
    const { count } = await client.reservation.deleteMany({
      where: {
        AND: [
          { startTime: { lt: endTime } }, // reservation starts before comment ends
          { endTime: { gt: startTime } }, // reservation ends after comment starts
          { status: { not: 'ADMINMADE' } }, // admin reservations are never auto-deleted
        ],
      },
    });
    return count;
  }
}
