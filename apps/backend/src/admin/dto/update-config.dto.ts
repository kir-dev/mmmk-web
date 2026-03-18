import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNumber, IsOptional, IsPositive, Min, ValidateNested } from 'class-validator';

export class SanctionTierDto {
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

export class UpdateConfigDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  userDailyHours?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  userWeeklyHours?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  bandDailyHours?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  bandWeeklyHours?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SanctionTierDto)
  @IsOptional()
  sanctionTiers?: SanctionTierDto[];
}
