import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { UpdateOpenedWeekDto } from './dto/update-opened-week.dto';

@Injectable()
export class OpenedWeeksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.openedWeek.findMany({
      orderBy: { monday: 'asc' },
    });
  }

  async upsert(dto: UpdateOpenedWeekDto) {
    const monday = new Date(dto.monday);
    return this.prisma.openedWeek.upsert({
      where: { monday },
      update: { isOpen: dto.isOpen },
      create: { monday, isOpen: dto.isOpen },
    });
  }
}
