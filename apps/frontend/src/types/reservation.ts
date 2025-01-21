import { ReservationStatus } from '@prisma/client';

export type Reservation = {
  id: number;
  userId: number;
  bandId: number;
  startTime: Date;
  endTime: Date;
  gateKeeperId: number;
  status: ReservationStatus;
};
