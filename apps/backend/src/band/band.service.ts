import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

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
    try {
      const res = await this.prisma.band.findMany();
      if (!res) throw new Error();
      return res;
    } catch (error) {
      throw new NotFoundException('No bands found');
    }
  }

  async findOne(id: number): Promise<Band> {
    try {
      const res = await this.prisma.band.findUnique({ where: { id } });
      if (!res) throw new Error();
      return res;
    } catch (error) {
      throw new NotFoundException('No band found');
    }
  }

  async update(id: number, updateBandDto: UpdateBandDto): Promise<Band> {
    try {
      const res = await this.prisma.band.update({ where: { id }, data: updateBandDto });
      if (!res) throw new Error();
      return res;
    } catch (error) {
      throw new NotFoundException('No bands found');
    }
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
}
