import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class Band {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  webPage: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  genres: string;
}
