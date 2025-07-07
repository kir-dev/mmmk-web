import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TextArea } from '@/components/ui/textarea';
import { Post } from '@/types/post';

export function NewsForm({
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
    onSave({ title, body, authorId: '1' }); //TODO: replace with real authorId
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
