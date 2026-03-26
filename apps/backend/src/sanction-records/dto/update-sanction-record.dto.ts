import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateSanctionRecordDto {
  @IsNumber()
  @IsOptional()
  @IsPositive()
  points?: number;

  @IsString()
  @IsOptional()
  reason?: string;
}
