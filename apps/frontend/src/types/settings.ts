export type Settings = {
  id: number;
  maxHoursPerWeek: number;
  maxHoursPerDay: number;
  minReservationMinutes: number;
  maxReservationMinutes: number;
  sanctionHourPenaltyPerPoint: number;
  maxTotalHoursPerWeek: number;
  sanctionTotalHourPenaltyPerPoint: number;
  banSanctionPointThreshold: number;
};
