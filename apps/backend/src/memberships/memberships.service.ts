import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { UpdateMembershipDto } from './dto/update-membership.dto';

@Injectable()
export class MembershipsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.clubMembership.findMany();
  }

  async findOne(id: number) {
    const membership = await this.prisma.clubMembership.findUnique({
      where: { id },
    });
    if (!membership) {
      throw new NotFoundException('Membership with id ${id} not found');
    }
    return membership;
  }

  async update(id: number, updateMembershipDto: UpdateMembershipDto) {
    try {
      return await this.prisma.clubMembership.update({
        where: {
          id,
        },
        data: updateMembershipDto,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(`Membership with id ${id} not found`);
        }
      }
      throw e;
    }
  }

  async remove(id: number) {
    return this.prisma.clubMembership.delete({
      where: { id },
    });
  }
}
