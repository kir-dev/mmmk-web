import { Band } from '@/types/band';
import { ClubMembership } from '@/types/member';
import { User } from '@/types/user';

export enum ReservationStatus {
  OVERTIME = 'OVERTIME',
  NORMAL = 'NORMAL',
  ADMINMADE = 'ADMINMADE',
  SANCTIONED = 'SANCTIONED',
}

export enum GateKeeperPriority {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
}

export type Reservation = {
  id: number;
  userId: number;
  bandId: number;
  startTime: Date;
  endTime: Date;
  gateKeeperId: number;
  gateKeeperPriority?: GateKeeperPriority;
  status: ReservationStatus;
  band: Band;
  gateKeeper: ClubMembership;
  user: User;
  needToBeLetIn: boolean;
};
