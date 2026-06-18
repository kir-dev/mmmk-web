/* eslint-disable max-lines */
/* eslint-disable no-console */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BandMembershipStatus, GateKeeperPriority, Prisma, ReservationStatus, Role, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { PaginationDto } from '../dto/pagination.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReservationDto: CreateReservationDto, currentUser: User) {
    const dto = await this.authorizeCreate(createReservationDto, currentUser);

    // Validate the reservation
    await this.validateReservation(dto);

    // Determine status
    const status =
      currentUser.role === Role.ADMIN && dto.status === ReservationStatus.ADMINMADE
        ? ReservationStatus.ADMINMADE
        : await this.determineReservationStatus(dto);

    return this.prisma.reservation.create({
      data: {
        ...dto,
        status,
      },
    });
  }

  private async authorizeCreate(dto: CreateReservationDto, currentUser: User): Promise<CreateReservationDto> {
    if (currentUser.role === Role.ADMIN) {
      return dto;
    }

    const sanitized = { ...dto };
    if (sanitized.status === ReservationStatus.ADMINMADE) {
      throw new ForbiddenException('Admin foglalást csak admin hozhat létre.');
    }
    if (sanitized.gateKeeperId !== undefined && sanitized.gateKeeperId !== null) {
      throw new ForbiddenException('Beengedőt csak meglévő foglaláshoz lehet hozzárendelni.');
    }
    if (sanitized.gateKeeperPriority !== undefined && sanitized.gateKeeperPriority !== null) {
      throw new ForbiddenException('Beengedői prioritást csak meglévő foglaláshoz lehet hozzárendelni.');
    }

    (sanitized as Partial<CreateReservationDto>).status = undefined;

    if (sanitized.userId !== undefined && sanitized.userId !== null && sanitized.userId !== currentUser.id) {
      throw new ForbiddenException('Más felhasználó nevében csak admin foglalhat.');
    }

    if (sanitized.bandId !== undefined && sanitized.bandId !== null) {
      const membership = await this.prisma.bandMembership.findFirst({
        where: { bandId: sanitized.bandId, userId: currentUser.id, status: BandMembershipStatus.ACCEPTED },
      });
      if (!membership) {
        throw new ForbiddenException('Csak olyan zenekar nevében foglalhatsz, amelynek elfogadott tagja vagy.');
      }
    }

    return sanitized;
  }

  private async validateReservation(dto: CreateReservationDto | UpdateReservationDto, excludeId?: number) {
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

    // 2. Validate duration against the configured min/max reservation length (falls back to
    // 30 min / 3 hours if settings haven't been initialized yet).
    const durationSettings = await this.prisma.settings.findFirst();
    const minMinutes = durationSettings?.minReservationMinutes ?? 30;
    const maxMinutes = durationSettings?.maxReservationMinutes ?? 180;
    const durationMs = endTime.getTime() - startTime.getTime();
    const minDuration = minMinutes * 60 * 1000;
    const maxDuration = maxMinutes * 60 * 1000;

    if (durationMs < minDuration) {
      throw new BadRequestException(`A foglalás túl rövid. Kérlek, adj meg legalább ${minMinutes} perces idősávot.`);
    }
    if (durationMs > maxDuration) {
      throw new BadRequestException(
        `A foglalás túl hosszú. A maximálisan foglalható időtartam ${maxMinutes / 60} óra.`
      );
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

    // 3b. Band eligibility: single-member bands and duplicate-member bands cannot book.
    // Admins booking on someone's behalf (ADMINMADE) bypass these checks.
    if (hasBandId && dto.bandId && dto.status !== ReservationStatus.ADMINMADE) {
      await this.validateBandEligibility(dto.bandId);
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
      throw new BadRequestException('Sajnáljuk, de erre a hétre még nem nyitottuk meg a foglalási lehetőséget.');
    }

    // 6. Prevent overlapping a protected reservation. NORMAL and ADMINMADE reservations may not
    // be booked over; OVERTIME ones are freely overwritable, so overlaps with them are allowed.
    // Admin bookings (ADMINMADE) bypass this — they may override anyone.
    if (dto.status !== ReservationStatus.ADMINMADE) {
      const conflict = await this.prisma.reservation.findFirst({
        where: {
          id: excludeId ? { not: excludeId } : undefined,
          status: { in: [ReservationStatus.NORMAL, ReservationStatus.ADMINMADE] },
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
      });
      if (conflict) {
        throw new BadRequestException('A terem már foglalt a kiválasztott idősávban.');
      }
    }
  }

  /**
   * Enforces the spec's band booking rules:
   *  - a band with fewer than 2 accepted members cannot book,
   *  - if another band has the exact same set of accepted members, neither may book.
   */
  private async validateBandEligibility(bandId: number) {
    const acceptedMemberIds = async (id: number): Promise<number[]> => {
      const memberships = await this.prisma.bandMembership.findMany({
        where: { bandId: id, status: BandMembershipStatus.ACCEPTED },
        select: { userId: true },
      });
      return memberships
        .map((m) => m.userId)
        .filter((uid): uid is number => uid !== null)
        .sort((a, b) => a - b);
    };

    const memberIds = await acceptedMemberIds(bandId);

    if (memberIds.length < 2) {
      throw new BadRequestException('Egytagú zenekarok nem foglalhatnak időpontot.');
    }

    const fingerprint = memberIds.join(',');
    const otherBands = await this.prisma.band.findMany({
      where: { id: { not: bandId } },
      select: { id: true },
    });

    for (const other of otherBands) {
      const otherIds = await acceptedMemberIds(other.id);
      if (otherIds.length === memberIds.length && otherIds.join(',') === fingerprint) {
        throw new BadRequestException(
          'Egy másik, pontosan ugyanezekből a tagokból álló zenekar is létezik, ezért ez a zenekar nem foglalhat.'
        );
      }
    }
  }

  private async determineReservationStatus(dto: CreateReservationDto, excludeId?: number): Promise<ReservationStatus> {
    // Admin-made reservations keep their ADMINMADE status
    if (dto.status === ReservationStatus.ADMINMADE) {
      return ReservationStatus.ADMINMADE;
    }

    // Band reservations have their own daily/weekly budget, separate from any member's
    // personal budget. Over-budget band reservations become OVERTIME (freely overwritable).
    if (!dto.userId) {
      if (!dto.bandId) {
        return ReservationStatus.NORMAL;
      }
      const settings = await this.prisma.settings.findFirst();
      if (!settings) {
        return ReservationStatus.NORMAL;
      }
      return this.statusFromBlockLimits(
        { bandId: dto.bandId },
        dto,
        excludeId,
        settings.maxHoursPerDay,
        settings.maxHoursPerWeek
      );
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
        `A foglalás megtagadva: Elérted a szankciós küszöböt. Jelenleg ${sanctionPoints} pontod van, a megengedett maximum ${settings.banSanctionPointThreshold}.`
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
        `A foglalás nem hozható létre: Túllépted a heti időkeretet. (Elérhető: ${adjustedTotalWeeklyLimit} óra, Szankciós pontjaid: ${sanctionPoints})`
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

  /**
   * Determines NORMAL vs OVERTIME for a reservation owner (a user or a band) based purely on
   * NORMAL-block daily/weekly hour limits. Existing OVERTIME reservations don't count toward
   * the limits, since they're already freely overwritable.
   */
  private async statusFromBlockLimits(
    ownerWhere: Prisma.ReservationWhereInput,
    dto: CreateReservationDto,
    excludeId: number | undefined,
    dailyLimit: number,
    weeklyLimit: number
  ): Promise<ReservationStatus> {
    const start = new Date(dto.startTime);

    const dayOfWeek = (start.getDay() + 6) % 7; // Monday = 0
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const dayStart = new Date(start);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);

    const sumHours = (rs: { startTime: Date; endTime: Date }[]) =>
      rs.reduce((total, r) => total + (new Date(r.endTime).getTime() - new Date(r.startTime).getTime()) / 3_600_000, 0);

    const weeklyReservations = await this.prisma.reservation.findMany({
      where: {
        ...ownerWhere,
        id: excludeId ? { not: excludeId } : undefined,
        status: { not: ReservationStatus.OVERTIME },
        startTime: { gte: weekStart, lt: weekEnd },
      },
    });

    const dailyReservations = await this.prisma.reservation.findMany({
      where: {
        ...ownerWhere,
        id: excludeId ? { not: excludeId } : undefined,
        status: { not: ReservationStatus.OVERTIME },
        startTime: { gte: dayStart, lt: dayEnd },
      },
    });

    const newDuration = (new Date(dto.endTime).getTime() - start.getTime()) / 3_600_000;

    if (
      sumHours(weeklyReservations) + newDuration > weeklyLimit ||
      sumHours(dailyReservations) + newDuration > dailyLimit
    ) {
      return ReservationStatus.OVERTIME;
    }
    return ReservationStatus.NORMAL;
  }

  findAll(page?: number, pageSize?: number, gateKeeperId?: number): Promise<PaginationDto<Reservation>> {
    const hasPagination = page !== -1 && pageSize !== -1;
    const where = gateKeeperId ? { gateKeeperId } : undefined;
    const reservations = this.prisma.reservation.findMany({
      where,
      skip: hasPagination ? (page - 1) * pageSize : undefined,
      take: hasPagination ? pageSize : undefined,
      include: {
        user: true,
        band: true,
        gateKeeper: { include: { user: true } },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    const count = this.prisma.reservation.count({ where });

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

  async update(id: number, updateReservationDto: UpdateReservationDto, currentUser: User) {
    const existing = await this.prisma.reservation.findUniqueOrThrow({
      where: { id },
      include: { gateKeeper: { include: { user: true } } },
    });

    await this.assertCanUpdate(existing, updateReservationDto, currentUser);

    if (
      currentUser.role !== Role.ADMIN &&
      updateReservationDto.status !== undefined &&
      updateReservationDto.status !== existing.status
    ) {
      throw new ForbiddenException('A foglalás státuszát csak admin vagy a szerver kvótaellenőrzése módosíthatja.');
    }

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

          // Override logic: PRIMARY overrides SECONDARY.
          // The overridden gatekeeper is notified by email from the client (see onSetGK in
          // useReservationDetails), which owns the mail integration (/api/kir-mail).
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
      await this.validateReservation(dto as any, id);

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

  async remove(id: number, currentUser: User) {
    const existing = await this.prisma.reservation.findUniqueOrThrow({ where: { id } });

    // Admins may delete anything. Otherwise: ADMINMADE is admin-only, OVERTIME is freely
    // overwritable by anyone, and NORMAL reservations may only be deleted by their owner.
    if (currentUser.role !== Role.ADMIN) {
      if (existing.status === ReservationStatus.ADMINMADE) {
        throw new ForbiddenException('Admin által létrehozott foglalást csak admin törölhet.');
      }
      if (
        existing.status !== ReservationStatus.OVERTIME &&
        !(await this.userOwnsReservation(existing, currentUser.id))
      ) {
        throw new ForbiddenException('Ezt a foglalást csak a létrehozója vagy admin törölheti.');
      }
    }

    try {
      return await this.prisma.reservation.delete({
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

  /** Whether the user is the reservation's owner (personal booking) or an accepted band member. */
  private async userOwnsReservation(
    reservation: { userId: number | null; bandId: number | null },
    userId: number
  ): Promise<boolean> {
    if (reservation.userId && reservation.userId === userId) {
      return true;
    }
    if (reservation.bandId) {
      const membership = await this.prisma.bandMembership.findFirst({
        where: { bandId: reservation.bandId, userId, status: BandMembershipStatus.ACCEPTED },
      });
      return membership !== null;
    }
    return false;
  }

  /** Whether the user is an active gatekeeper (has a club membership flagged as gatekeeper). */
  private async getGateKeeperMembership(userId: number): Promise<{ id: number; isGateKeeper: boolean } | null> {
    return this.prisma.clubMembership.findUnique({
      where: { userId },
      select: { id: true, isGateKeeper: true },
    });
  }

  /**
   * Authorizes a reservation update. Gatekeeper-field changes (admission) require gatekeeper
   * rights; content changes require ownership/admin, with OVERTIME freely overwritable and
   * ADMINMADE admin-only.
   */
  private async assertCanUpdate(
    existing: { userId: number | null; bandId: number | null; gateKeeperId?: number | null; status: ReservationStatus },
    dto: UpdateReservationDto,
    currentUser: User
  ): Promise<void> {
    if (currentUser.role === Role.ADMIN) {
      return;
    }

    const touchesGateKeeper = 'gateKeeperId' in dto || 'gateKeeperPriority' in dto;
    const touchesContent =
      dto.startTime !== undefined ||
      dto.endTime !== undefined ||
      dto.userId !== undefined ||
      dto.bandId !== undefined ||
      dto.status !== undefined ||
      dto.needToBeLetIn !== undefined;

    if (touchesGateKeeper) {
      const membership = await this.getGateKeeperMembership(currentUser.id);
      if (!membership?.isGateKeeper) {
        throw new ForbiddenException('Beengedőt csak beengedő jogosultsággal rendelkező felhasználó állíthat be.');
      }
      if (await this.userOwnsReservation(existing, currentUser.id)) {
        throw new ForbiddenException('Saját vagy saját zenekari foglaláshoz nem jelentkezhetsz beengedőnek.');
      }
      if (dto.gateKeeperId !== undefined && dto.gateKeeperId !== null && dto.gateKeeperId !== membership.id) {
        throw new ForbiddenException('Beengedőként csak saját magadat rendelheted hozzá a foglaláshoz.');
      }
      if (dto.gateKeeperId === null && existing.gateKeeperId && existing.gateKeeperId !== membership.id) {
        throw new ForbiddenException('Más beengedési szándékát csak admin törölheti.');
      }
      if (
        dto.gateKeeperPriority !== undefined &&
        dto.gateKeeperId === undefined &&
        existing.gateKeeperId !== membership.id
      ) {
        throw new ForbiddenException('Más beengedési prioritását csak admin módosíthatja.');
      }
    }

    if (touchesContent) {
      if (existing.status === ReservationStatus.ADMINMADE) {
        throw new ForbiddenException('Admin által létrehozott foglalást csak admin módosíthat.');
      }
      if (
        existing.status !== ReservationStatus.OVERTIME &&
        !(await this.userOwnsReservation(existing, currentUser.id))
      ) {
        throw new ForbiddenException('Ezt a foglalást csak a létrehozója vagy admin módosíthatja.');
      }
    }
  }
}
