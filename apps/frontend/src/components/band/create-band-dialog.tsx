'use client';

import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TextArea } from '@/components/ui/textarea';
import { useUser } from '@/hooks/useUser';
import axiosApi from '@/lib/apiSetup';
import { Band } from '@/types/band';

type CreateBandDialogProps = {
  onCreated?: (band: Band) => void;
};

export default function CreateBandDialog({ onCreated }: CreateBandDialogProps) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [webPage, setWebPage] = useState('');
  const [description, setDescription] = useState('');
  const [genresInput, setGenresInput] = useState('');

  useEffect(() => {
    if (!open) {
      setName('');
      setEmail('');
      setWebPage('');
      setDescription('');
      setGenresInput('');
      setSubmitting(false);
    }
  }, [open]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const genres = genresInput
        .split(',')
        .map((g) => g.trim())
        .filter((g) => g.length > 0);
      const payload = {
        name,
        email: email || undefined,
        webPage: webPage || undefined,
        description: description || undefined,
        genres,
      };
      const res = await axiosApi.post('/bands', payload);
      const band: Band = res.data;

      if (user?.id && band?.id) {
        try {
          await axiosApi.post(`/bands/${band.id}/members/${user.id}`);
        } catch (err) {
          // ignore membership add error
        }
      }

      onCreated?.(band);
      setOpen(false);
    } catch (e: any) {
      if (e?.response?.status === 401) {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zenekar létrehozása</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-3'>
          <Input placeholder='Név' value={name} onChange={(e) => setName(e.target.value)} required />
          <Input placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder='Weboldal' value={webPage} onChange={(e) => setWebPage(e.target.value)} />
          <TextArea
            placeholder='Leirás'
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            placeholder='Műfajok (vesszővel elválasztva)'
            value={genresInput}
            onChange={(e) => setGenresInput(e.target.value)}
          />
          <div className='flex justify-end gap-2 mt-2'>
            <Button variant='ghost' onClick={() => setOpen(false)} disabled={submitting}>
              Megse
            </Button>
            <Button onClick={handleCreate} disabled={submitting || !name.trim()}>
              Letrehozas
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
