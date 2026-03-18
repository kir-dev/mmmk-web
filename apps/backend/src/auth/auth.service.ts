import { AuthSchProfile } from '@kir-dev/passport-authsch';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  login(user: User): string {
    return this.jwtService.sign(user, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7 days',
    });
  }

  async findOrCreateUser(userProfile: AuthSchProfile): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { authSchId: userProfile.authSchId } });
    if (user) {
      return user;
    }

    return this.prisma.user.create({
      data: {
        authSchId: userProfile.authSchId,
        fullName: userProfile.fullName,
        email: userProfile.email,
        phone: userProfile.phone,
      },
    });
  }

  async syncClubMembership(user: User, userProfile: AuthSchProfile): Promise<User> {
    // Skip if the user's PEK profile has not been updated since the last check
    if (user.clubMembershipUpdatedAt && userProfile.pek.updatedAt < user.clubMembershipUpdatedAt.valueOf() / 1000) {
      return this.prisma.user.update({ where: { id: user.id }, data: { clubMembershipUpdatedAt: new Date() } });
    }

    // If the user is not a member of MMMK
    if (
      !(
        userProfile.pek.activeMemberAt.some((membership) => membership.groupName === process.env.PEK_GROUP_NAME) ||
        userProfile.pek.alumniMemberAt.some((membership) => membership.groupName === process.env.MMMK_GROUP_NAME) ||
        userProfile.pek.executiveAt.some((membership) => membership.groupName === process.env.MMMK_GROUP_NAME)
      )
    ) {
      // If the user's membership has been terminated, remove their club membership record
      this.prisma.clubMembership.delete({ where: { userId: user.id } });

      return this.prisma.user.update({ where: { id: user.id }, data: { clubMembershipUpdatedAt: new Date() } });
    }

    // Active member at MMMK
    for (const membership of userProfile.pek.activeMemberAt) {
      if (membership.groupName === process.env.PEK_GROUP_NAME) {
        const clubMembership = await this.prisma.clubMembership.upsert({
          where: { userId: user.id },
          update: {
            status: membership.titles.includes(process.env.PEK_NEWBIE_TITLE) ? 'NEWBIE' : 'ACTIVE',
            titles: membership.titles.filter(
              (title) => title !== process.env.PEK_NEWBIE_TITLE && title !== process.env.PEK_MEMBER_TITLE
            ),
            isGateKeeper: membership.titles.includes(process.env.PEK_GATEKEEPER_TITLE),
          },
          create: {
            user: { connect: { id: user.id } },
            status: membership.titles.includes(process.env.PEK_NEWBIE_TITLE) ? 'NEWBIE' : 'ACTIVE',
            titles: membership.titles.filter(
              (title) => title !== process.env.PEK_NEWBIE_TITLE && title !== process.env.PEK_MEMBER_TITLE
            ),
            isGateKeeper: membership.titles.includes(
              process.env.PEK_GATEKEEPER_TITLE || process.env.PEK_ROOM_MANAGER_TITLE
            ),
            hasRoomAccess: false,
            isLeadershipMember: false,
          },
        });

        return this.prisma.user.update({
          where: { id: user.id },
          data: {
            clubMembership: { connect: { id: clubMembership.id } },
            clubMembershipUpdatedAt: new Date(),
          },
        });
      }
    }

    // Senior member at MMMK
    for (const membership of userProfile.pek.alumniMemberAt) {
      if (membership.groupName === process.env.MMMK_GROUP_NAME) {
        const clubMembership = await this.prisma.clubMembership.upsert({
          where: { userId: user.id },
          update: {
            status: 'SENIOR',
            isGateKeeper: false,
          },
          create: {
            user: { connect: { id: user.id } },
            status: 'SENIOR',
            isGateKeeper: false,
            hasRoomAccess: false,
            isLeadershipMember: false,
          },
        });

        return this.prisma.user.update({
          where: { id: user.id },
          data: {
            clubMembership: { connect: { id: clubMembership.id } },
            clubMembershipUpdatedAt: new Date(),
          },
        });
      }
    }
  }
}
