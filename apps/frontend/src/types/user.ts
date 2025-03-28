import { CardRight, ProfilePicture } from '@prisma/client';

export type User = {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  isDormResident: boolean;
  roomNumber?: string;
  role: string;
  cardRight?: CardRight;
  profilePicture?: ProfilePicture;
  created_at: string;
  updated_at: string;
};
