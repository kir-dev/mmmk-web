import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class CreatePeriodDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;
}
