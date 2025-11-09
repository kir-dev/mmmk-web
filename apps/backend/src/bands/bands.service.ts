import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BandMembership, BandMembershipStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { User } from 'src/users/entities/user.entity';

import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';
import { Band } from './entities/band.entity';

@Injectable()
export class BandsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBandDto: CreateBandDto): Promise<Band> {
    return await this.prisma.band.create({ data: createBandDto });
  }

  async findAll(): Promise<Band[]> {
    const res = await this.prisma.band.findMany({
      include: { members: { include: { user: { select: { fullName: true } } } } },
    });
    return res;
  }

  async findOne(id: number): Promise<Band> {
    try {
      const res = await this.prisma.band.findUniqueOrThrow({ where: { id } });
      return res;
    } catch (error) {
      throw new NotFoundException('No band found');
    }
  }

  async update(id: number, updateBandDto: UpdateBandDto): Promise<Band> {
    return await this.prisma.band.update({ where: { id }, data: updateBandDto });
  }

  async remove(id: number): Promise<Band> {
    try {
      const res = await this.prisma.band.delete({ where: { id } });
      return res;
    } catch (error) {
      throw new NotFoundException('No bands found');
    }
  }

  async findMembers(id: number): Promise<User[]> {
    try {
      const bandmemberships = await this.prisma.bandMembership.findMany({
        where: { bandId: id },
        include: { user: true },
      });
      return bandmemberships.map((membership) => membership.user);
    } catch (error) {
      throw new NotFoundException('No members found');
    }
  }

  async addMember(bandId: number, userId: number): Promise<BandMembership> {
    try {
      const existing = await this.prisma.bandMembership.findFirst({ where: { bandId, userId } });
      if (existing) {
        throw new ConflictException('User is already a member of this band');
      }
      const res = await this.prisma.bandMembership.create({
        data: { band: { connect: { id: bandId } }, user: { connect: { id: userId } } },
      });
      return res;
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new NotFoundException('Member could not be added');
    }
  }

  async removeMember(bandId: number, userId: number) {
    try {
      const res = await this.prisma.bandMembership.deleteMany({ where: { bandId, userId } });
      const members = await this.findMembers(bandId);
      if (members.length === 0) {
        await this.remove(bandId);
      }
      return res;
    } catch (error) {
      throw new NotFoundException('No member found');
    }
  }

  async approveMember(bandId: number, userId: number) {
    try {
      return await this.prisma.bandMembership.updateMany({
        where: { bandId, userId },
        data: { status: BandMembershipStatus.ACCEPTED },
      });
    } catch (error) {
      throw new NotFoundException('No member found');
    }
  }
}
