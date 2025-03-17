import { CardRight, ProfilePicture } from '.prisma/client';

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  isDormResident: boolean;
  roomNumber?: string;
  role: string;
  cardRight?: CardRight;
  profilePicture?: ProfilePicture | string;
  created_at: string;
  updated_at: string;
};
