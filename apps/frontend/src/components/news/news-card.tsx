import { Pencil, Trash } from 'lucide-react';

import { Post } from '@/types/post';

import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '../ui/card';

export default function NewsCard({
  post,
  isAdmin,
  openEditDialog,
  handleDelete,
}: {
  post: Post;
  isAdmin: boolean;
  openEditDialog: (post: Post) => void;
  handleDelete: (id: string) => Promise<void>;
}) {
  return (
    <Card key={post.id} className='relative border-0 border-l-4'>
      <CardTitle className='p-4'>{post.title}</CardTitle>
      {isAdmin && (
        <div className='absolute top-4 right-4 flex gap-2'>
          <Button size='sm' variant='secondary' onClick={() => openEditDialog(post)}>
            <Pencil className='w-4 h-4' />
          </Button>
          <Button className='bg-red-500' size='sm' variant='destructive' onClick={() => handleDelete(post.id)}>
            <Trash className='w-4 h-4' />
          </Button>
        </div>
      )}
      <CardContent className='p-4'>{post.body}</CardContent>
      <CardFooter className='py-2 px-4 text-sm text-gray-500 dark:text-gray-400'>
        {new Date(post.createdAt).toLocaleDateString('hu-HU')}
      </CardFooter>
    </Card>
  );
}
