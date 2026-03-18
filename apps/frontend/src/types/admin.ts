export type SanctionTier = {
  id: number;
  configId: number;
  minPoints: number;
  userDailyHours: number;
  userWeeklyHours: number;
  bandDailyHours: number;
  bandWeeklyHours: number;
};

export type ReservationConfig = {
  id: number;
  userDailyHours: number;
  userWeeklyHours: number;
  bandDailyHours: number;
  bandWeeklyHours: number;
  sanctionTiers: SanctionTier[];
};

export type SanctionTierInput = Omit<SanctionTier, 'id' | 'configId'>;

export type UpdateConfigInput = {
  userDailyHours?: number;
  userWeeklyHours?: number;
  bandDailyHours?: number;
  bandWeeklyHours?: number;
  sanctionTiers?: SanctionTierInput[];
};
