'use client';

import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Pencil, Plus, Trash } from 'lucide-react';
import { useState } from 'react';

import { NewsForm } from '@/components/news/news-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import usePosts from '@/hooks/use-post';
import { mockUsers } from '@/mocks/users';
import { Post } from '@/types/post';
import { User } from '@/types/user';
import api from '@/utils/api-setup';

export default function NewsPage() {
  const currentUser: User = mockUsers[1]; //TODO: replace with real user
  const isAdmin = currentUser.role === 'ADMIN';
  const [page, setPage] = useState(1);
  const { data: posts, isLoading, mutate } = usePosts(page, 10);
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function handleCreate(post: Omit<Post, 'id' | 'createdAt'>) {
    await api.post('/posts', {
      title: post.title,
      body: post.body,
      authorId: 1,
    });
    await mutate();
  }

  async function handleEdit(post: Omit<Post, 'id' | 'createdAt'>) {
    if (!editing) return;
    await api.patch(`/posts/${editing.id}`, {
      title: post.title,
      body: post.body,
    });
    await mutate();
    setEditing(null);
  }

  async function handleDelete(id: string) {
    await api.delete(`/posts/${id}`);
    await mutate();
  }

  function openCreateDialog() {
    setCreating(true);
    setEditing(null);
    setDialogOpen(true);
  }

  function openEditDialog(post: Post) {
    setEditing(post);
    setCreating(false);
    setDialogOpen(true);
  }

  return (
    <div className='w-full overflow-y-auto'>
      <div className='flex items-center justify-between flex-row p-4'>
        <h1 className='text-2xl font-semibold text-primary'>Hírek</h1>
        {isAdmin && (
          <Button onClick={openCreateDialog}>
            <Plus />
          </Button>
        )}
      </div>
      <div className='m-4'>
        <div className='space-y-4'>
          {isLoading && <p>Loading...</p>}
          {posts?.data &&
            posts.data.map((post: Post) => (
              <Card key={post.id} className='relative border-0 border-l-4'>
                <CardTitle className='p-4'>{post.title}</CardTitle>
                {isAdmin && (
                  <div className='absolute top-4 right-4 flex gap-2'>
                    <Button size='sm' variant='secondary' onClick={() => openEditDialog(post)}>
                      <Pencil className='w-4 h-4' />
                    </Button>
                    <Button
                      className='bg-red-500'
                      size='sm'
                      variant='destructive'
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash className='w-4 h-4' />
                    </Button>
                  </div>
                )}
                <CardContent className='p-4'>{post.body}</CardContent>
                <CardFooter className='py-2 px-4 text-sm text-gray-500 dark:text-gray-400'>
                  {new Date(post.createdAt).toLocaleDateString('hu-HU')}
                </CardFooter>
              </Card>
            ))}
          {posts && posts.count > 0 && (
            <div className='flex justify-center gap-2 mt-8'>
              <Button className='pr-5' variant='secondary' disabled={page === 1} onClick={() => setPage(1)}>
                <ChevronFirst />
                Első
              </Button>
              <Button className='pr-5' variant='secondary' disabled={page === 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft />
                Előző
              </Button>
              <span className='px-2 py-1'>
                {page}. oldal / {Math.ceil(posts.count / 10)}
              </span>
              <Button
                className='pl-5'
                variant='secondary'
                disabled={page === Math.ceil(posts.count / 10)}
                onClick={() => setPage(page + 1)}
              >
                Következő <ChevronRight />
              </Button>
              <Button
                className='pl-5'
                variant='secondary'
                disabled={page === Math.ceil(posts.count / 10)}
                onClick={() => setPage(Math.ceil(posts.count / 10))}
              >
                Utolsó <ChevronLast />
              </Button>
            </div>
          )}
        </div>
      </div>

      <NewsForm
        initial={editing || undefined}
        onSave={creating ? handleCreate : handleEdit}
        onCancel={() => {
          setCreating(false);
          setEditing(null);
        }}
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
