import { User } from '../../users/entities/user.entity';

export class Post {
  id: number;
  title: string;
  body: string;
  createdAt: Date;
  authorId: number;
  author?: User;
}
