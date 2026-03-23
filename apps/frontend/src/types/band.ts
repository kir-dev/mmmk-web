export type Band = {
  id: number;
  name: string;
  email: string;
  webPage: string;
  description: string;
  genres?: string[];
  isApproved: boolean;
  members?: BandMembership[];
};

export type BandMembership = {
  id: number;
  userId: number;
  bandId: number;
  status: 'PENDING' | 'ACCEPTED';
  createdAt: string;
};
