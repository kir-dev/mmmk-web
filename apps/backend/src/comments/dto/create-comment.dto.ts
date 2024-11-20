import { OmitType } from '@nestjs/swagger';

import { Comment } from '../entities/comment.entity';

export class CreateCommentDto extends OmitType(Comment, ['id']) {}
