import { ClubMembershipStatus } from '@prisma/client';

import { Reservation } from '@/types/reservation';

export type ClubMembership = {
  id: number;
  userId: number;
  status: ClubMembershipStatus;
  titles: string[];
  hasRoomAccess: boolean;
  isLeadershipMember: boolean;
  isGateKeeper: boolean;
  gateKeepingRecords: Reservation[];
};
