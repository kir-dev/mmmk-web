import { Injectable, NotFoundException } from '@nestjs/common';
import { BandMembership, BandMembershipStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { User } from 'src/users/entities/user.entity';

import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';
import { Band } from './entities/band.entity';

@Injectable()
export class BandService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBandDto: CreateBandDto): Promise<Band> {
    return await this.prisma.band.create({ data: createBandDto });
  }

  async findAll(): Promise<Band[]> {
    const res = await this.prisma.band.findMany();
    if (!res) throw new NotFoundException();
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
      if (!res) throw new Error();
      return res;
    } catch (error) {
      throw new NotFoundException('No bands found');
    }
  }

  async findMembers(id: number): Promise<User[]> {
    try {
      const bandmemberships = await this.prisma.bandMembership.findMany({
        where: { bandId: id, status: BandMembershipStatus.ACCEPTED },
      });
      const members = await this.prisma.user.findMany({
        where: { id: { in: bandmemberships.map((membership) => membership.userId) } },
      });
      return members;
    } catch (error) {
      this.remove(id);
      throw new NotFoundException('No members found, band deleted');
    }
  }

  async addMember(bandId: number, userId: number): Promise<BandMembership> {
    try {
      const res = await this.prisma.bandMembership.create({
        data: { band: { connect: { id: bandId } }, user: { connect: { id: userId } } },
      });
      if (!res) throw new Error();
      return res;
    } catch (error) {
      throw new NotFoundException('Member could not be added');
    }
  }

  async removeMember(bandId: number, userId: number): Promise<BandMembership> {
    try {
      const res = await this.prisma.bandMembership.deleteMany({ where: { bandId, userId } });
      if (!res) throw new Error();
      return res;
    } catch (error) {
      throw new NotFoundException('No member found');
    }
  }
}
