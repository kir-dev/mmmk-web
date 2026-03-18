import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class SanctionRecord {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsNumber()
  @IsOptional()
  bandId?: number;

  @IsNumber()
  @IsPositive()
  points: number;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsNumber()
  @IsPositive()
  awardedBy: number;

  awardedAt: Date;
}
