export interface SanctionRecord {
  id: number;
  userId?: number;
  bandId?: number;
  reservationId?: number;
  points: number;
  reason: string;
  awardedBy: number;
  awardedAt: Date;
}
