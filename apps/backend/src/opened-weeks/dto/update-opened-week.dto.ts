import { IsBoolean, IsDateString, IsNotEmpty } from 'class-validator';

export class UpdateOpenedWeekDto {
  @IsNotEmpty()
  @IsDateString()
  monday: string;

  @IsNotEmpty()
  @IsBoolean()
  isOpen: boolean;
}
