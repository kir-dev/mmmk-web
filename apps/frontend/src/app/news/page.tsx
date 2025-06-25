'use client';

import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Pencil, Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

import { TextArea } from '@/components/ui/textarea';
import { mockUsers } from '@/mocks/users';
import { User } from '@/types/user';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { apiService, Post as ApiPost } from '../../lib/api';

const POSTS_PER_PAGE = 10;

function NewsForm({
  initial,
  onSave,
  onCancel,
  isOpen,
  onOpenChange,
  isLoading,
}: {
  initial?: Partial<ApiPost>;
  onSave: (post: { title: string; body: string }) => void;
  onCancel: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
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
          <DialogTitle>{initial ? 'Szerkesztés' : 'Új poszt'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            placeholder='Cím'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading}
          />
          <TextArea
            placeholder='Tartalom'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={6}
            disabled={isLoading}
          />
          <div className='flex gap-2 justify-end'>
            <Button type='button' variant='secondary' onClick={handleCancel} disabled={isLoading}>
              Mégsem
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Mentés...' : 'Mentés'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function NewsPage() {
  const currentUser: User = mockUsers[1]; //TODO: replace with real user
  const isAdmin = currentUser.role === 'ADMIN';
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editing, setEditing] = useState<ApiPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, [page]);

  async function loadPosts() {
    try {
      setIsLoadingPosts(true);
      setError(null);
      const response = await apiService.getPosts(page, POSTS_PER_PAGE);
      setPosts(response.posts);
      setTotalPages(Math.ceil(response.total / POSTS_PER_PAGE));
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error loading posts:', err);
    } finally {
      setIsLoadingPosts(false);
    }
  }

  async function handleCreate(post: { title: string; body: string }) {
    try {
      setIsLoading(true);
      await apiService.createPost(post);
      setCreating(false);
      setPage(1);
      await loadPosts();
    } catch (err) {
      setError('Failed to create post');
      console.error('Error creating post:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEdit(post: { title: string; body: string }) {
    if (!editing) return;
    try {
      setIsLoading(true);
      await apiService.updatePost(editing.id, post);
      setEditing(null);
      await loadPosts();
    } catch (err) {
      setError('Failed to update post');
      console.error('Error updating post:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await apiService.deletePost(id);
      await loadPosts();
    } catch (err) {
      setError('Failed to delete post');
      console.error('Error deleting post:', err);
    }
  }

  function openCreateDialog() {
    setCreating(true);
    setEditing(null);
    setDialogOpen(true);
  }

  function openEditDialog(post: ApiPost) {
    setEditing(post);
    setCreating(false);
    setDialogOpen(true);
  }

  if (isLoadingPosts) {
    return (
      <div className='w-full overflow-y-auto'>
        <div className='flex items-center justify-between flex-row p-4'>
          <h1 className='text-2xl font-semibold text-primary'>Hírek</h1>
        </div>
        <div className='m-4'>
          <div className='flex items-center justify-center h-64'>
            <p>Hírek betöltése...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full overflow-y-auto'>
      <div className='flex items-center justify-between flex-row p-4'>
        <h1 className='text-2xl font-semibold text-primary'>Hírek</h1>
        {isAdmin && (
          <Button onClick={openCreateDialog}>
            <Plus className='w-4 h-4' />
          </Button>
        )}
      </div>
      <div className='m-4'>
        {error && <div className='mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded'>{error}</div>}
        <div className='space-y-4'>
          {posts.map((post) => (
            <Card key={post.id} className='relative'>
              <CardTitle className='p-4'>{post.title}</CardTitle>
              {isAdmin && (
                <div className='absolute top-4 right-4 flex gap-2'>
                  <Button size='sm' variant='secondary' onClick={() => openEditDialog(post)}>
                    <Pencil className='w-4 h-4' />
                  </Button>
                  <Button size='sm' variant='destructive' onClick={() => handleDelete(post.id)}>
                    <Trash className='w-4 h-4' />
                  </Button>
                </div>
              )}
              <CardContent className='p-4'>{post.body}</CardContent>
              <CardFooter className='py-2 px-4 text-sm text-gray-500 dark:text-gray-400'>
                {new Date(post.createdAt).toLocaleDateString('hu-HU')}
                {post.author && ` • ${post.author.name}`}
              </CardFooter>
            </Card>
          ))}
        </div>
        {totalPages > 1 && (
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
            <Button
              className='pl-5'
              variant='secondary'
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
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
        )}
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
        isLoading={isLoading}
      />
    </div>
  );
}
