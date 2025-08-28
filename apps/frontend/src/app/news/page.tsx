'use client';

import { Pencil, Trash } from 'lucide-react';
import { useState } from 'react';

import { TextArea } from '@/components/ui/textarea';
import { mockUsers } from '@/mocks/users';
import { User } from '@/types/user';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { posts as mockNewsPosts } from '../../mocks/posts';
import { Post } from '../../types/post';

const POSTS_PER_PAGE = 10;

function NewsForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Post>;
  onSave: (post: Omit<Post, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title || '');
  const [body, setBody] = useState(initial?.body || '');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ title, body });
      }}
      className='space-y-2 px-4'
    >
      <Input placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} required />
      <TextArea placeholder='Body' value={body} onChange={(e) => setBody(e.target.value)} required rows={3} />
      <div className='flex gap-2'>
        <Button type='submit'>Save</Button>
        <Button type='button' variant='secondary' onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function NewsPage() {
  const currentUser: User = mockUsers[1]; //TODO: replace with real user
  const isAdmin = currentUser.role === 'ADMIN';
  const [posts, setPosts] = useState<Post[]>(mockNewsPosts);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginated = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  function handleCreate(post: Omit<Post, 'id' | 'createdAt'>) {
    setPosts([
      {
        id: (Math.random() * 100000).toFixed(0),
        title: post.title,
        body: post.body,
        createdAt: new Date().toISOString(),
      },
      ...posts,
    ]);
    setCreating(false);
    setPage(1);
  }

  function handleEdit(post: Omit<Post, 'id' | 'createdAt'>) {
    if (!editing) return;
    setPosts(posts.map((p) => (p.id === editing.id ? { ...p, ...post } : p)));
    setEditing(null);
  }

  function handleDelete(id: string) {
    setPosts(posts.filter((p) => p.id !== id));
  }

  return (
    <div className='w-full overflow-y-auto'>
      <div className='flex items-center justify-between flex-row p-4'>
        <h1 className='text-2xl font-semibold text-primary'>Hírek</h1>
        {isAdmin && (
          <div>
            {creating ? (
              <NewsForm onSave={handleCreate} onCancel={() => setCreating(false)} />
            ) : (
              <Button onClick={() => setCreating(true)}>Create New Post</Button>
            )}
          </div>
        )}
      </div>
      <div className='m-4'>
        <div className='space-y-4'>
          {paginated.map((post) => (
            <Card key={post.id} className='relative'>
              <CardTitle className='p-4'>{editing?.id === post.id ? 'Szerkesztés' : post.title}</CardTitle>
              {editing?.id === post.id && (
                <div className='mt-4'>
                  <NewsForm initial={editing} onSave={handleEdit} onCancel={() => setEditing(null)} />
                </div>
              )}
              {isAdmin && (
                <div className='absolute top-4 right-4 flex gap-2'>
                  <Button size='sm' variant='secondary' onClick={() => setEditing(post)}>
                    <Pencil className='w-4 h-4' />
                  </Button>
                  <Button size='sm' variant='destructive' onClick={() => handleDelete(post.id)}>
                    <Trash className='w-4 h-4' />
                  </Button>
                </div>
              )}
              <CardContent className='p-4'>{editing?.id === post.id ? null : post.body}</CardContent>
              <CardFooter className='py-2 px-4 text-sm text-gray-500 dark:text-gray-400'>
                {editing?.id === post.id ? null : new Date(post.createdAt).toLocaleDateString('hu-HU')}
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className='flex justify-center gap-2 mt-8'>
          <Button variant='secondary' disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className='px-2 py-1'>
            Page {page} of {totalPages}
          </span>
          <Button variant='secondary' disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
