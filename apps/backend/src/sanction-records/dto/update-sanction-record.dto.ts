import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateSanctionRecordDto {
  @IsNumber()
  @IsOptional()
  @IsPositive()
  points?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  reason?: string;
}
