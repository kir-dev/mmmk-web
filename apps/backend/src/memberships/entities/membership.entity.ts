import { ClubMembershipStatus } from '@prisma/client';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsPositive } from 'class-validator';

export class ClubMembership {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsNumber()
  @IsPositive()
  userId: number;

  @IsEnum(ClubMembershipStatus)
  status: ClubMembershipStatus;

  @IsArray()
  titles: string[];

  @IsBoolean()
  hasRoomAccess: boolean;

  @IsBoolean()
  isLeadershipMember: boolean;

  @IsBoolean()
  isGateKeeper: boolean;
}
