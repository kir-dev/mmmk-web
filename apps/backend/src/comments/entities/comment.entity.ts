import { IsDate, IsNumber, IsPositive, IsString } from 'class-validator';

export class Comment {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsString()
  comment: string;

  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;
}
