import { BandMembership } from '@/types/band';
import { ClubMembership } from '@/types/member';
import { Reservation } from '@/types/reservation';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export type ProfilePicture = {
  id: number;
  userId: number;
  mimeType: string;
  image: string;
};

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
