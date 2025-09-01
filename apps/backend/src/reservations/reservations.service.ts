import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { PaginationDto } from '../dto/pagination.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createReservationDto: CreateReservationDto) {
    return this.prisma.reservation.create({
      data: {
        ...createReservationDto,
      },
    });
  }

  findAll(page?: number, pageSize?: number): Promise<PaginationDto<Reservation>> {
    const hasPagination = page !== -1 && pageSize !== -1;
    const reservations = this.prisma.reservation.findMany({
      skip: hasPagination ? (page - 1) * pageSize : undefined,
      take: hasPagination ? pageSize : undefined,
      orderBy: {
        startTime: 'asc',
      },
    });

    const count = this.prisma.reservation.count();

    return Promise.all([reservations, count])
      .then(([reservations, count]) => {
        const limit = hasPagination ? Math.floor(count / pageSize) : 0;
        return {
          data: reservations,
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
      return await this.prisma.reservation.findUniqueOrThrow({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(`This reservation doesn't exist.`);
        }
        throw new InternalServerErrorException('An error occurred.');
      }
    }
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    try {
      return await this.prisma.reservation.update({
        where: {
          id,
        },
        data: {
          ...updateReservationDto,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(`This reservation doesn't exist.`);
        }
        throw new InternalServerErrorException('An error occurred.');
      }
    }
  }

  remove(id: number) {
    try {
      return this.prisma.reservation.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(`This reservation doesn't exist.`);
        }
        throw new InternalServerErrorException('An error occurred.');
      }
    }
  }
}
