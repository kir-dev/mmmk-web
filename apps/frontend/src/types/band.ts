export type Band = {
  id: number;
  name: string;
  email: string;
  webPage: string;
  description: string;
  genres?: string[];
  members?: BandMembership[];
};

export type BandMembership = {
  id: number;
  bandId: number;
  userId: number;
  status: string;
};
