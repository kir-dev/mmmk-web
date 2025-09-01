import { OmitType } from '@nestjs/swagger';

import { Post } from '../entities/post.entity';

export class CreatePostDto extends OmitType(Post, ['id', 'createdAt']) {}
