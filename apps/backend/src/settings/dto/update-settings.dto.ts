import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxHoursPerWeek?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxHoursPerDay?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  minReservationMinutes?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxReservationMinutes?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sanctionHourPenaltyPerPoint?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxTotalHoursPerWeek?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sanctionTotalHourPenaltyPerPoint?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  banSanctionPointThreshold?: number;
}
