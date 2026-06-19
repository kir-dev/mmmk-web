import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateSanctionRecordDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  userId?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  bandId?: number;

  @IsInt()
  @IsPositive()
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
