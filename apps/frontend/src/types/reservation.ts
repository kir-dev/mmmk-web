import { Band, ClubMembership, ReservationStatus, User } from '@prisma/client';

export type Reservation = {
  id: number;
  userId: number;
  bandId: number;
  startTime: Date;
  endTime: Date;
  gateKeeperId: number;
  status: ReservationStatus;
  band: Band;
  gateKeeper: ClubMembership;
  user: User;
};
