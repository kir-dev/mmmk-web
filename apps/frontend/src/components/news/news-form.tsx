import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TextArea } from '@/components/ui/textarea';
import { useUser } from '@/hooks/useUser';
import { sanitizeUtfInput } from '@/lib/sanitize';
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
  const TITLE_MAX = 120;
  const BODY_MAX = 4000;
  const [title, setTitle] = useState(initial?.title || '');
  const [body, setBody] = useState(initial?.body || '');
  const { user } = useUser();

  useEffect(() => {
    setTitle(initial?.title || '');
    setBody(initial?.body || '');
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.length > TITLE_MAX || body.length > BODY_MAX) return;
    onSave({ title, body, authorId: `${user?.id}` });
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
          <DialogTitle>{initial ? 'Szerkesztés' : 'Új bejegyzés'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            placeholder='Cím'
            value={title}
            onChange={(e) => setTitle(sanitizeUtfInput(e.target.value))}
            required
            maxLength={TITLE_MAX}
          />
          <TextArea
            placeholder='Tartalom'
            value={body}
            onChange={(e) => setBody(sanitizeUtfInput(e.target.value))}
            required
            rows={6}
            maxLength={BODY_MAX}
          />
          <div className='flex gap-2 justify-end'>
            <Button type='button' variant='secondary' onClick={handleCancel}>
              Mégse
            </Button>
            <Button type='submit'>Mentés</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
