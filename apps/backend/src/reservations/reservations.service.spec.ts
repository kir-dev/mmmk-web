import { Test, TestingModule } from '@nestjs/testing';
import { GateKeeperPriority, ReservationStatus, Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { ReservationsService } from './reservations.service';

describe('ReservationsService', () => {
  let service: ReservationsService;

  const mockPrismaService = {
    reservation: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    period: {
      findFirst: jest.fn(),
    },
    openedWeek: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    settings: {
      findFirst: jest.fn(),
    },
    bandMembership: {
      findFirst: jest.fn(),
    },
    clubMembership: {
      findUnique: jest.fn(),
    },
  };

  const settings = {
    minReservationMinutes: 30,
    maxReservationMinutes: 180,
    maxHoursPerDay: 3,
    maxHoursPerWeek: 6,
    maxTotalHoursPerWeek: 12,
    sanctionHourPenaltyPerPoint: 1,
    sanctionTotalHourPenaltyPerPoint: 2,
    banSanctionPointThreshold: 5,
  };

  const baseReservationDto = {
    userId: 1,
    startTime: new Date('2026-06-22T10:00:00.000Z'),
    endTime: new Date('2026-06-22T11:00:00.000Z'),
    status: ReservationStatus.NORMAL,
    needToBeLetIn: false,
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockPrismaService.settings.findFirst.mockResolvedValue(settings);
    mockPrismaService.period.findFirst.mockResolvedValue({ id: 1 });
    mockPrismaService.openedWeek.findUnique.mockResolvedValue({ id: 1, isOpen: true });
    mockPrismaService.reservation.findFirst.mockResolvedValue(null);
    mockPrismaService.reservation.findMany.mockResolvedValue([]);
    mockPrismaService.reservation.create.mockImplementation(({ data }) => Promise.resolve(data));
    mockPrismaService.user.findUnique.mockResolvedValue({ id: 1, sanctionRecords: [] });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('rejects non-admin reservation creation for another user', async () => {
    await expect(
      service.create({ ...baseReservationDto, userId: 2 } as any, { id: 1, role: Role.USER } as any)
    ).rejects.toThrow('Más felhasználó nevében csak admin foglalhat.');

    expect(mockPrismaService.reservation.create).not.toHaveBeenCalled();
  });

  it('rejects non-admin admin-made reservation creation', async () => {
    await expect(
      service.create(
        { ...baseReservationDto, status: ReservationStatus.ADMINMADE } as any,
        { id: 1, role: Role.USER } as any
      )
    ).rejects.toThrow('Admin foglalást csak admin hozhat létre.');

    expect(mockPrismaService.reservation.create).not.toHaveBeenCalled();
  });

  it('recomputes non-admin reservation status instead of trusting the request body', async () => {
    const created = await service.create(
      { ...baseReservationDto, status: ReservationStatus.OVERTIME } as any,
      { id: 1, role: Role.USER } as any
    );

    expect(created.status).toBe(ReservationStatus.NORMAL);
  });

  it('rejects non-admin band reservation creation without accepted membership', async () => {
    mockPrismaService.bandMembership.findFirst.mockResolvedValue(null);

    await expect(
      service.create({ ...baseReservationDto, userId: undefined, bandId: 1 } as any, { id: 1, role: Role.USER } as any)
    ).rejects.toThrow('Csak olyan zenekar nevében foglalhatsz, amelynek elfogadott tagja vagy.');

    expect(mockPrismaService.reservation.create).not.toHaveBeenCalled();
  });

  it('rejects non-admin manual status changes', async () => {
    mockPrismaService.reservation.findUniqueOrThrow.mockResolvedValue({
      id: 1,
      userId: 1,
      bandId: null,
      gateKeeperId: null,
      status: ReservationStatus.OVERTIME,
    });

    await expect(
      service.update(1, { status: ReservationStatus.NORMAL } as any, { id: 2, role: Role.USER } as any)
    ).rejects.toThrow('A foglalás státuszát csak admin vagy a szerver kvótaellenőrzése módosíthatja.');
  });

  it('rejects gatekeeper assignment to an owned reservation', async () => {
    mockPrismaService.reservation.findUniqueOrThrow.mockResolvedValue({
      id: 1,
      userId: 1,
      bandId: null,
      gateKeeperId: null,
      status: ReservationStatus.NORMAL,
    });
    mockPrismaService.clubMembership.findUnique.mockResolvedValue({ id: 10, isGateKeeper: true });

    await expect(
      service.update(
        1,
        { gateKeeperId: 10, gateKeeperPriority: GateKeeperPriority.PRIMARY } as any,
        { id: 1, role: Role.USER } as any
      )
    ).rejects.toThrow('Saját vagy saját zenekari foglaláshoz nem jelentkezhetsz beengedőnek.');
  });
});
