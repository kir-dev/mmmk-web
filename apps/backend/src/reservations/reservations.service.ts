/* eslint-disable max-lines */
/* eslint-disable no-console */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GateKeeperPriority, Prisma, ReservationStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { PaginationDto } from '../dto/pagination.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReservationDto: CreateReservationDto) {
    // Validate the reservation
    await this.validateReservation(createReservationDto);

    // Determine status
    const status = await this.determineReservationStatus(createReservationDto);

    return this.prisma.reservation.create({
      data: {
        ...createReservationDto,
        status: createReservationDto.status || status,
      },
    });
  }

  private async validateReservation(dto: CreateReservationDto | UpdateReservationDto) {
    // Skip validation if times aren't provided (for partial updates)
    if (!dto.startTime || !dto.endTime) {
      return;
    }

    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    // 1. Validate 15-minute intervals
    if (startTime.getMinutes() % 15 !== 0 || endTime.getMinutes() % 15 !== 0) {
      throw new BadRequestException(
        'Kezdő és befejező időpont 15 perces intervallumokra kerekítve kell legyen (:00, :15, :30, :45)'
      );
    }

    // 2. Validate duration (30 min - 3 hours)
    const durationMs = endTime.getTime() - startTime.getTime();
    const minDuration = 30 * 60 * 1000;
    const maxDuration = 3 * 60 * 60 * 1000;

    if (durationMs < minDuration) {
      throw new BadRequestException('Foglalás minimum 30 perc hosszú kell legyen');
    }
    if (durationMs > maxDuration) {
      throw new BadRequestException('Foglalás maximum 3 óra hosszú lehet');
    }

    // 3. Validate exclusive user OR band (only check for CreateReservationDto)
    const hasUserId = 'userId' in dto && dto.userId !== undefined && dto.userId !== null;
    const hasBandId = 'bandId' in dto && dto.bandId !== undefined && dto.bandId !== null;

    if (!hasUserId && !hasBandId) {
      throw new BadRequestException('Felhasználó vagy banda megadása kötelező');
    }
    if (hasUserId && hasBandId) {
      throw new BadRequestException('Csak felhasználó VAGY banda adható meg, nem mindkettő');
    }

    // 4. Check if Period is open
    const openPeriod = await this.prisma.period.findFirst({
      where: {
        isOpen: true,
        startDate: { lte: startTime },
        endDate: { gte: endTime },
      },
    });

    if (!openPeriod && dto.status !== ReservationStatus.ADMINMADE) {
      throw new BadRequestException('A kiválasztott időpont nem esik egyetlen nyitott félévbe/időszakba sem.');
    }

    // 5. Check if Week is open
    // Find the Monday of the week for startTime
    const dayOfWeek = (startTime.getDay() + 6) % 7; // Monday = 0
    const weekStart = new Date(startTime);
    weekStart.setDate(startTime.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);

    const openedWeek = await this.prisma.openedWeek.findUnique({
      where: { monday: weekStart },
    });

    if ((!openedWeek || !openedWeek.isOpen) && dto.status !== ReservationStatus.ADMINMADE) {
      throw new BadRequestException('Ez a hét még nem lett megnyitva a foglalások számára.');
    }
  }

  private async determineReservationStatus(dto: CreateReservationDto, excludeId?: number): Promise<ReservationStatus> {
    // Admin-made reservations keep their ADMINMADE status
    if (dto.status === ReservationStatus.ADMINMADE) {
      return ReservationStatus.ADMINMADE;
    }

    if (!dto.userId) {
      return ReservationStatus.NORMAL; // Band reservations default to NORMAL
    }

    // Check user sanctions - now calculated from SanctionRecord table
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      include: {
        sanctionRecords: true,
      },
    });

    if (!user) {
      return ReservationStatus.NORMAL;
    }

    // Calculate total sanction points from records
    const sanctionPoints = user.sanctionRecords.reduce((sum, record) => sum + record.points, 0);

    // Check quota for overtime
    const settings = await this.prisma.settings.findFirst();
    if (!settings) {
      return ReservationStatus.NORMAL;
    }

    if (sanctionPoints >= settings.banSanctionPointThreshold) {
      throw new ForbiddenException(
        `A foglalás megtagadva: Elérted a tiltási küszöböt (${settings.banSanctionPointThreshold} pont).`
      );
    }

    // Get user's reservations this week
    const now = new Date(dto.startTime);
    const dayOfWeek = (now.getDay() + 6) % 7; // Monday = 0
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    // Get day boundaries
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);

    // Calculate total weekly hours (both NORMAL and OVERTIME)
    const allWeeklyReservations = await this.prisma.reservation.findMany({
      where: {
        id: excludeId ? { not: excludeId } : undefined,
        userId: dto.userId,
        startTime: { gte: weekStart, lt: weekEnd },
      },
    });

    const totalWeeklyHours = allWeeklyReservations.reduce((total, r) => {
      const duration = new Date(r.endTime).getTime() - new Date(r.startTime).getTime();
      return total + duration / (1000 * 60 * 60);
    }, 0);

    const newDuration = (new Date(dto.endTime).getTime() - new Date(dto.startTime).getTime()) / (1000 * 60 * 60);
    const adjustedTotalWeeklyLimit = Math.max(
      0,
      settings.maxTotalHoursPerWeek - sanctionPoints * settings.sanctionTotalHourPenaltyPerPoint
    );

    if (totalWeeklyHours + newDuration > adjustedTotalWeeklyLimit) {
      throw new ForbiddenException(
        `A foglalás megtagadva: Túllépted a maximális heti limitet (${adjustedTotalWeeklyLimit} óra a szankciókkal együtt).`
      );
    }

    const weeklyReservations = allWeeklyReservations.filter((r) => r.status !== ReservationStatus.OVERTIME);

    const dailyReservations = await this.prisma.reservation.findMany({
      where: {
        id: excludeId ? { not: excludeId } : undefined,
        userId: dto.userId,
        startTime: { gte: dayStart, lt: dayEnd },
        status: { not: ReservationStatus.OVERTIME },
      },
    });

    const weeklyHours = weeklyReservations.reduce((total, r) => {
      const duration = new Date(r.endTime).getTime() - new Date(r.startTime).getTime();
      return total + duration / (1000 * 60 * 60);
    }, 0);

    const dailyHours = dailyReservations.reduce((total, r) => {
      const duration = new Date(r.endTime).getTime() - new Date(r.startTime).getTime();
      return total + duration / (1000 * 60 * 60);
    }, 0);

    const adjustedWeeklyLimit = Math.max(
      0,
      settings.maxHoursPerWeek - sanctionPoints * settings.sanctionHourPenaltyPerPoint
    );
    const adjustedDailyLimit = Math.max(
      0,
      settings.maxHoursPerDay - (sanctionPoints * settings.sanctionHourPenaltyPerPoint) / 2
    );

    // Check both weekly AND daily limits for OVERTIME
    if (weeklyHours + newDuration > adjustedWeeklyLimit || dailyHours + newDuration > adjustedDailyLimit) {
      return ReservationStatus.OVERTIME;
    }

    return ReservationStatus.NORMAL;
  }

  findAll(page?: number, pageSize?: number): Promise<PaginationDto<Reservation>> {
    const hasPagination = page !== -1 && pageSize !== -1;
    const reservations = this.prisma.reservation.findMany({
      skip: hasPagination ? (page - 1) * pageSize : undefined,
      take: hasPagination ? pageSize : undefined,
      include: {
        user: true,
        band: true,
        gateKeeper: { include: { user: true } }
      },
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
        include: {
          user: true,
          band: true,
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
    const existing = await this.prisma.reservation.findUniqueOrThrow({
      where: { id },
      include: { gateKeeper: { include: { user: true } } },
    });

    // Handle gatekeeper priority and override logic
    if (updateReservationDto.gateKeeperId !== undefined) {
      // If clearing gatekeeper, also clear priority
      if (updateReservationDto.gateKeeperId === null) {
        updateReservationDto.gateKeeperPriority = null;
      } else {
        // If assigning a new gatekeeper
        if (!updateReservationDto.gateKeeperPriority) {
          throw new BadRequestException('Beengedő mellé prioritás megadása kötelező');
        }

        if (existing.gateKeeperId && existing.gateKeeperId !== updateReservationDto.gateKeeperId) {
          if (existing.gateKeeperPriority === GateKeeperPriority.PRIMARY) {
            throw new ForbiddenException('Ezt a foglalást már egy elsődleges beengedő elvállalta');
          }

          if (updateReservationDto.gateKeeperPriority !== GateKeeperPriority.PRIMARY) {
            throw new BadRequestException('Csak elsődleges prioritással lehet felülbírálni egy meglévő beengedőt');
          }

          // Override logic: PRIMARY overrides SECONDARY
          // TODO: Send email to the overridden gatekeeper if possible
          // In a real scenario, we'd inject an EmailService here
          console.log(`Gatekeeper ${existing.gateKeeperId} was overridden by ${updateReservationDto.gateKeeperId}`);
        }
      }
    }

    // Validate if time fields are being updated
    if (updateReservationDto.startTime || updateReservationDto.endTime) {
      const dto = {
        userId: existing.userId,
        bandId: existing.bandId,
        startTime: existing.startTime,
        endTime: existing.endTime,
        status: existing.status,
        ...updateReservationDto,
      };
      await this.validateReservation(dto as any);

      // Recalculate status if time or user/band changes
      const newStatus = await this.determineReservationStatus(dto as any, id);
      updateReservationDto.status = newStatus;
    }

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
