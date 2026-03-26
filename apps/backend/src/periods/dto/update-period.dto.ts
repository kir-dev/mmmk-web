import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class UpdatePeriodDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;
}
