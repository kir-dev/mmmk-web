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
    // Normalize to the canonical Monday-midnight of the week (server-local, i.e. club time), so the
    // stored key always matches what the reservation validation computes when it looks the week up.
    const monday = new Date(dto.monday);
    const dayOfWeek = (monday.getDay() + 6) % 7; // Monday = 0
    monday.setDate(monday.getDate() - dayOfWeek);
    monday.setHours(0, 0, 0, 0);

    return this.prisma.openedWeek.upsert({
      where: { monday },
      update: { isOpen: dto.isOpen },
      create: { monday, isOpen: dto.isOpen },
    });
  }
}
