import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateSanctionRecordDto {
  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsNumber()
  @IsOptional()
  bandId?: number;

  @IsNumber()
  @IsOptional()
  reservationId?: number;

  @IsNumber()
  @IsPositive()
  points: number;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsNumber()
  @IsPositive()
  awardedBy: number;
}
