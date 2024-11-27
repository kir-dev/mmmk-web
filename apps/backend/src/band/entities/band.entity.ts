import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class Band {
  @IsNotEmpty()
  @IsNumber()
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
}
