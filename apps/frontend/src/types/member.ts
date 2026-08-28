import { Reservation } from '@/types/reservation';
import { User } from '@/types/user';

export enum ClubMembershipStatus {
  NEWBIE = 'NEWBIE',
  ACTIVE = 'ACTIVE',
  SENIOR = 'SENIOR',
}

export type ClubMembership = {
  id: number;
  userId: number;
  status: ClubMembershipStatus;
  titles: string[];
  hasRoomAccess: boolean;
  isLeadershipMember: boolean;
  isGateKeeper: boolean;
  gateKeepingRecords: Reservation[];
  // A foglalás-lekérdezés a beengedő felhasználóját is visszaadja.
  user?: User;
};
