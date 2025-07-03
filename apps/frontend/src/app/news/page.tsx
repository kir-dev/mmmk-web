'use client';

import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Pencil, Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { TextArea } from '@/components/ui/textarea';
import { mockPosts as mockNewsPosts } from '@/mocks/posts';
import { mockUsers } from '@/mocks/users';
import { User } from '@/types/user';
import api from '@/utils/apiSetup';
import { axiosGetFetcher } from '@/utils/fetchers';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Post } from '../../types/post';

const POSTS_PER_PAGE = 10;

function NewsForm({
  initial,
  onSave,
  onCancel,
  isOpen,
  onOpenChange,
}: {
  initial?: Partial<Post>;
  onSave: (post: Omit<Post, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [title, setTitle] = useState(initial?.title || '');
  const [body, setBody] = useState(initial?.body || '');

  useEffect(() => {
    setTitle(initial?.title || '');
    setBody(initial?.body || '');
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, body });
    onOpenChange(false);
    setTitle('');
    setBody('');
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
    setTitle('');
    setBody('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit Post' : 'Create New Post'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} required />
          <TextArea placeholder='Body' value={body} onChange={(e) => setBody(e.target.value)} required rows={6} />
          <div className='flex gap-2 justify-end'>
            <Button type='button' variant='secondary' onClick={handleCancel}>
              Cancel
            </Button>
            <Button type='submit'>Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function NewsPage() {
  const currentUser: User = mockUsers[1]; //TODO: replace with real user
  const isAdmin = currentUser.role === 'ADMIN';
  const { data, isLoading } = useSWR<Post[]>(`/posts?page=${-1}&page_size=${-1}`, axiosGetFetcher);
  const [posts, setPosts] = useState<Post[]>(mockNewsPosts);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  //const paginated = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
  const paginated = 1;

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data]);

  function handleCreate(post: Omit<Post, 'id' | 'createdAt'>) {
    /*    setPosts([
      {
        id: (Math.random() * 100000).toFixed(0),
        title: post.title,
        body: post.body,
        createdAt: new Date().toISOString(),
      },
      ...posts,
    ]);
    setCreating(false);
    setPage(1);*/
    api.post('/posts', {
      title: post.title,
      body: post.body,
      authorId: 1,
    });
  }

  function handleEdit(post: Omit<Post, 'id' | 'createdAt'>) {
    if (!editing) return;
    setPosts(posts.map((p) => (p.id === editing.id ? { ...p, ...post } : p)));
    setEditing(null);
  }

  function handleDelete(id: string) {
    setPosts(posts.filter((p) => p.id !== id));
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
          {isLoading && <p>skibidi sigma</p>}
          {Array.isArray(posts) &&
            posts.map((post) => (
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
        </div>
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
            {page}. oldal / {totalPages}
          </span>
          <Button className='pl-5' variant='secondary' disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Következő <ChevronRight />
          </Button>
          <Button
            className='pl-5'
            variant='secondary'
            disabled={page === totalPages}
            onClick={() => setPage(totalPages)}
          >
            Utolsó <ChevronLast />
          </Button>
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
