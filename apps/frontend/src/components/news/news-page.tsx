'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import NewsCard from '@/components/news/news-card';
import { NewsForm } from '@/components/news/news-form';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/ui/pagination';
import usePosts from '@/hooks/use-post';
import { useUser } from '@/hooks/useUser';
import { Post } from '@/types/post';
import { Role } from '@/types/user';
import api from '@/utils/api-setup';

export default function News() {
  const { user: currentUser } = useUser();
  const isAdmin = currentUser?.role === Role.ADMIN;
  const [page, setPage] = useState(1);
  const { data: posts, isLoading, mutate } = usePosts(page, 10);
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function handleCreate(post: Omit<Post, 'id' | 'createdAt'>) {
    if (!isAdmin || !currentUser) return;
    await api.post('/posts', {
      title: post.title,
      body: post.body,
      authorId: currentUser.id,
    });
    await mutate();
  }

  async function handleEdit(post: Omit<Post, 'id' | 'createdAt'>) {
    if (!isAdmin || !editing) return;
    await api.patch(`/posts/${editing.id}`, {
      title: post.title,
      body: post.body,
    });
    await mutate();
    setEditing(null);
  }

  async function handleDelete(id: string) {
    if (!isAdmin) return;
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
    <div className='w-full main-content-scroll h-full'>
      <div className='flex items-center justify-between flex-col sm:flex-row gap-3 p-4 bg-background sticky top-0 z-10'>
        <h1 className='text-2xl font-semibold text-primary w-full sm:w-auto text-center sm:text-left'>Hírek</h1>
        {isAdmin && (
          <Button onClick={openCreateDialog} className='w-full sm:w-auto'>
            <Plus />
          </Button>
        )}
      </div>
      <div className='m-4'>
        <div className='space-y-4'>
          {isLoading && <p>Betöltés…</p>}
          {posts?.data &&
            posts.data.map((post: Post) => (
              <NewsCard
                key={post.id}
                post={post}
                isAdmin={isAdmin}
                openEditDialog={openEditDialog}
                handleDelete={handleDelete}
              />
            ))}
          {posts && posts.count > 0 && <Pagination page={page} setPage={setPage} posts={posts} />}
        </div>
      </div>

      {isAdmin && (
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
      )}
    </div>
  );
}
