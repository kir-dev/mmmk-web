import { BandMembership, ClubMembership, ProfilePicture, Reservation, Role } from '@prisma/client';

export type User = {
  id: number;
  authSchId: string;
  fullName: string;
  email: string;
  phone?: string;
  isDormResident: boolean;
  roomNumber?: string;
  role: Role;
  clubMembership: ClubMembership;
  clubMembershipUpdatedAt: Date;
  profilePicture?: ProfilePicture;
  bandMemberShips?: BandMembership[];
  reservations?: Reservation[];
};
