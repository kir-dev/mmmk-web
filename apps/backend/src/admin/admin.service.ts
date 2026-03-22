import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { UpdateConfigDto } from './dto/update-config.dto';

const CONFIG_ID = 1;

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getConfig() {
    return this.prisma.reservationConfig.upsert({
      where: { id: CONFIG_ID },
      update: {},
      create: {},
      include: { sanctionTiers: { orderBy: { minPoints: 'asc' } } },
    });
  }

  async updateConfig(dto: UpdateConfigDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const { sanctionTiers, ...configFields } = dto;

        const config = await tx.reservationConfig.upsert({
          where: { id: CONFIG_ID },
          update: configFields,
          create: { id: CONFIG_ID, ...configFields },
        });

        if (sanctionTiers !== undefined) {
          await tx.sanctionTier.deleteMany({ where: { configId: config.id } });

          if (sanctionTiers.length > 0) {
            await tx.sanctionTier.createMany({
              data: sanctionTiers.map((tier) => ({ ...tier, configId: config.id })),
            });
          }
        }

        return tx.reservationConfig.findUnique({
          where: { id: config.id },
          include: { sanctionTiers: { orderBy: { minPoints: 'asc' } } },
        });
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(`Config not found.`);
        }
        throw new InternalServerErrorException('An error occurred.');
      }
      throw e;
    }
  }

  async setUserRole(requesterId: number, targetId: number, role: string) {
    if (requesterId === targetId) {
      throw new ForbiddenException('You cannot change your own role.');
    }
    try {
      return await this.prisma.user.update({
        where: { id: targetId },
        data: { role: role as 'USER' | 'ADMIN' },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(`User with id ${targetId} not found.`);
        }
        throw new InternalServerErrorException('An error occurred.');
      }
      throw e;
    }
  }
}
