import { Injectable, NotFoundException } from '@nestjs/common';
import { DormResidency, Prisma, Role, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { UpdateUserDto } from './dto/update-user.dto';

type UserWithDorm = User & { DormResidency: DormResidency | null };

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(currentUser?: User): Promise<{ users: User[] }> {
    const privileged = await this.isPrivileged(currentUser);
    const users = await this.prisma.user.findMany({ include: { DormResidency: true } });
    return { users: users.map((u) => this.serialize(u, privileged)) };
  }

  async findOne(id: number, currentUser?: User): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { DormResidency: true },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // The user always sees their own dorm/room data; otherwise only gatekeepers/admins do.
    const privileged = currentUser?.id === id || (await this.isPrivileged(currentUser));
    return this.serialize(user, privileged);
  }

  async findMe(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { authSchId: id },
      include: { DormResidency: true, clubMembership: true },
    });

    if (user === null) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Users always see their own dorm/room data.
    return this.serialize(user, true);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: {
          id,
        },
        data: updateUserDto,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(`User with id ${id} not found`);
        }
      }
      throw e;
    }
  }

  /** Whether the requester may see privileged fields (dorm status + room number): admins and gatekeepers. */
  private async isPrivileged(currentUser?: User): Promise<boolean> {
    if (!currentUser) {
      return false;
    }
    if (currentUser.role === Role.ADMIN) {
      return true;
    }
    const membership = await this.prisma.clubMembership.findUnique({ where: { userId: currentUser.id } });
    return membership?.isGateKeeper === true;
  }

  /**
   * Strips the DormResidency relation from the response. Dorm status (söci) and room number are
   * only exposed to privileged viewers (gatekeepers/admins) or the user themselves, per the spec.
   */
  private serialize(user: UserWithDorm, includeDormInfo: boolean): User {
    const { DormResidency, ...rest } = user;
    if (!includeDormInfo) {
      return rest;
    }
    return {
      ...rest,
      isDormResident: DormResidency !== null,
      roomNumber: DormResidency?.roomNumber,
    } as User & { isDormResident: boolean; roomNumber?: number };
  }
}
