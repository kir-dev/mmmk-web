import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CreateSanctionRecordDto } from './dto/create-sanction-record.dto';

@Injectable()
export class SanctionRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSanctionRecordDto) {
    // Validate that either userId or bandId is provided, but not both
    if (!dto.userId && !dto.bandId) {
      throw new BadRequestException('Either userId or bandId must be provided');
    }
    if (dto.userId && dto.bandId) {
      throw new BadRequestException('Cannot sanction both user and band at the same time');
    }

    // Verify the gatekeeper exists
    const gateKeeper = await this.prisma.clubMembership.findUnique({
      where: { id: dto.awardedBy },
    });
    if (!gateKeeper) {
      throw new NotFoundException('GateKeeper not found');
    }

    // Create the sanction record
    return this.prisma.sanctionRecord.create({
      data: {
        userId: dto.userId,
        bandId: dto.bandId,
        points: dto.points,
        reason: dto.reason,
        awardedBy: dto.awardedBy,
      },
      include: {
        user: true,
        band: true,
        gateKeeper: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.sanctionRecord.findMany({
      where: { userId },
      include: {
        gateKeeper: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { awardedAt: 'desc' },
    });
  }

  async findByBandId(bandId: number) {
    return this.prisma.sanctionRecord.findMany({
      where: { bandId },
      include: {
        gateKeeper: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { awardedAt: 'desc' },
    });
  }

  async findForCurrentUser(authSchId: string) {
    const user = await this.prisma.user.findUnique({
      where: { authSchId },
      include: {
        sanctionRecords: {
          include: {
            gateKeeper: {
              include: {
                user: true,
              },
            },
          },
          orderBy: { awardedAt: 'desc' },
        },
        bandMemberships: {
          where: { status: 'ACCEPTED' },
          include: {
            band: {
              include: {
                sanctionRecords: {
                  include: {
                    gateKeeper: {
                      include: {
                        user: true,
                      },
                    },
                  },
                  orderBy: { awardedAt: 'desc' },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Combine user sanctions with band sanctions
    const userSanctions = user.sanctionRecords.map((s) => ({
      ...s,
      type: 'user' as const,
    }));

    const bandSanctions = user.bandMemberships.flatMap(
      (bm) =>
        bm.band?.sanctionRecords.map((s) => ({
          ...s,
          type: 'band' as const,
          bandName: bm.band?.name,
        })) || []
    );

    // Combine and sort by date
    const allSanctions = [...userSanctions, ...bandSanctions].sort(
      (a, b) => new Date(b.awardedAt).getTime() - new Date(a.awardedAt).getTime()
    );

    return {
      userSanctions,
      bandSanctions,
      allSanctions,
      totalUserPoints: userSanctions.reduce((sum, s) => sum + s.points, 0),
      totalBandPoints: bandSanctions.reduce((sum, s) => sum + s.points, 0),
    };
  }

  async delete(id: number) {
    const record = await this.prisma.sanctionRecord.findUnique({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException(`Sanction record with id ${id} not found`);
    }

    return this.prisma.sanctionRecord.delete({
      where: { id },
    });
  }
}
