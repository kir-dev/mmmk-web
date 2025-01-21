import { Comment } from '@/types/comment';

export default function isComment(obj: unknown): obj is Comment {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'comment' in obj &&
    typeof (obj as any).id === 'number' &&
    typeof (obj as any).comment === 'string'
  );
}
