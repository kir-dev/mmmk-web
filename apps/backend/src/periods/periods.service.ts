import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';

@Injectable()
export class PeriodsService {
  constructor(private prisma: PrismaService) {}

  async create(createPeriodDto: CreatePeriodDto) {
    return this.prisma.period.create({
      data: createPeriodDto,
    });
  }

  async findAll() {
    return this.prisma.period.findMany({
      orderBy: { startDate: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.period.findUnique({
      where: { id },
    });
  }

  async update(id: number, updatePeriodDto: UpdatePeriodDto) {
    return this.prisma.period.update({
      where: { id },
      data: updatePeriodDto,
    });
  }

  async remove(id: number) {
    return this.prisma.period.delete({
      where: { id },
    });
  }
}
