import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Post {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  title: string;

  @IsString()
  body: string;

  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @IsNumber()
  authorId: number;
}
