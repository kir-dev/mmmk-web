import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    return this.prisma.settings.findUnique({
      where: { id },
    });
  }

  async findFirst() {
    // Enforce singleton: Get the first (and should be only) settings record
    let settings = await this.prisma.settings.findFirst();

    // If no settings exist, create default ones (singleton initialization)
    if (!settings) {
      settings = await this.prisma.settings.create({
        data: {
          maxHoursPerWeek: 8.0,
          maxHoursPerDay: 4.0,
          minReservationMinutes: 30,
          maxReservationMinutes: 180,
          sanctionHourPenaltyPerPoint: 1.0,
        },
      });
    }

    return settings;
  }

  async update(id: number, updateSettingsDto: UpdateSettingsDto) {
    // Only allow updating the first record to maintain singleton
    const existing = await this.findFirst();
    return this.prisma.settings.update({
      where: { id: existing.id }, // Always update the singleton record
      data: updateSettingsDto,
    });
  }
}
