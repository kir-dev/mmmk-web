import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNumber, IsOptional, IsPositive, Min, ValidateNested } from 'class-validator';

export class SanctionTier {
  @IsInt()
  @Min(0)
  minPoints: number;

  @IsNumber()
  @IsPositive()
  userDailyHours: number;

  @IsNumber()
  @IsPositive()
  userWeeklyHours: number;

  @IsNumber()
  @IsPositive()
  bandDailyHours: number;

  @IsNumber()
  @IsPositive()
  bandWeeklyHours: number;
}

export class ReservationConfig {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsNumber()
  @IsPositive()
  userDailyHours: number;

  @IsNumber()
  @IsPositive()
  userWeeklyHours: number;

  @IsNumber()
  @IsPositive()
  bandDailyHours: number;

  @IsNumber()
  @IsPositive()
  bandWeeklyHours: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SanctionTier)
  @IsOptional()
  sanctionTiers: SanctionTier[];
}
