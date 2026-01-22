import { Pencil, Pin, PinOff, Trash } from 'lucide-react';

import { Post } from '@/types/post';

import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '../ui/card';

export default function NewsCard({
  post,
  isAdmin,
  openEditDialog,
  handleDelete,
  handleTogglePin,
}: {
  post: Post;
  isAdmin: boolean;
  openEditDialog: (post: Post) => void;
  handleDelete: (id: string) => Promise<void>;
  handleTogglePin: (id: string) => Promise<void>;
}) {
  return (
    <Card key={post.id} className={`relative border-0 border-l-4 ${post.isPinned ? 'border-l-orange-500' : ''}`}>
      <CardTitle className='p-4'>
        {post.isPinned && <Pin className='inline w-4 h-4 mr-2 text-orange-500' />}
        {post.title}
      </CardTitle>
      {isAdmin && (
        <div className='absolute top-4 right-4 flex gap-2'>
          <Button size='sm' variant='secondary' onClick={() => handleTogglePin(post.id)}>
            {post.isPinned ? <PinOff className='w-4 h-4' /> : <Pin className='w-4 h-4' />}
          </Button>
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
