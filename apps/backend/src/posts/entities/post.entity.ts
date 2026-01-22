import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class Post {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsBoolean()
  isPinned: boolean;
}
