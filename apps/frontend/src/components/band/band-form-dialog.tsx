'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TextArea } from '@/components/ui/textarea';
import { useUser } from '@/hooks/useUser';
import axiosApi from '@/lib/apiSetup';
import { sanitizeUtfInput } from '@/lib/sanitize';
import { Band } from '@/types/band';

type Mode = 'create' | 'edit';

type BandFormDialogProps = {
  mode: Mode;
  band?: Band;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (band: Band) => void;
  trigger?: ReactNode;
};

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 200;
const MAX_WEBPAGE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_GENRES_LENGTH = 200;

export default function BandFormDialog({ mode, band, open, onOpenChange, onSuccess, trigger }: BandFormDialogProps) {
  const { user } = useUser();
  const isEdit = useMemo(() => mode === 'edit', [mode]);

  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState(band?.name || '');
  const [email, setEmail] = useState(band?.email || '');
  const [webPage, setWebPage] = useState(band?.webPage || '');
  const [description, setDescription] = useState(band?.description || '');
  const [genresInput, setGenresInput] = useState((band?.genres || []).join(', '));

  useEffect(() => {
    if (!open) {
      // reset to initial when closing
      setName(band?.name || '');
      setEmail(band?.email || '');
      setWebPage(band?.webPage || '');
      setDescription(band?.description || '');
      setGenresInput((band?.genres || []).join(', '));
      setSubmitting(false);
    } else if (isEdit) {
      // when opening edit, ensure fields reflect latest band
      setName(band?.name || '');
      setEmail(band?.email || '');
      setWebPage(band?.webPage || '');
      setDescription(band?.description || '');
      setGenresInput((band?.genres || []).join(', '));
    } else if (mode === 'create') {
      setName('');
      setEmail('');
      setWebPage('');
      setDescription('');
      setGenresInput('');
    }
  }, [open, isEdit, mode, band?.name, band?.email, band?.webPage, band?.description, band?.genres]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const genres = genresInput
        .split(',')
        .map((g) => g.trim())
        .filter((g) => g.length > 0);

      if (isEdit) {
        if (!band?.id) return;
        const payload = { name, email, webPage, description, genres };
        const res = await axiosApi.patch(`/bands/${band.id}`, payload);
        const updated: Band = res.data ?? { ...(band as Band), ...payload };
        onSuccess?.(updated);
        onOpenChange(false);
      } else {
        const payload = {
          name,
          email: email || undefined,
          webPage: webPage || undefined,
          description: description || undefined,
          genres,
        };
        const res = await axiosApi.post('/bands', payload);
        const created: Band = res.data;

        if (user?.id && created?.id) {
          try {
            await axiosApi.post(`/bands/${created.id}/members/${user.id}`);
          } catch (err) {
            // ignore membership add error
          }
        }

        onSuccess?.(created);
        onOpenChange(false);
      }
    } catch (e: any) {
      if (e?.response?.status === 401) {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Zenekar szerkesztése' : 'Zenekar létrehozása'}</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-3'>
          <Input
            placeholder='Név'
            value={name}
            onChange={(e) => setName(sanitizeUtfInput(e.target.value))}
            maxLength={MAX_NAME_LENGTH}
            required
          />
          <Input
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(sanitizeUtfInput(e.target.value))}
            maxLength={MAX_EMAIL_LENGTH}
          />
          <Input
            placeholder='Weboldal'
            value={webPage}
            onChange={(e) => setWebPage(sanitizeUtfInput(e.target.value))}
            maxLength={MAX_WEBPAGE_LENGTH}
          />
          <TextArea
            placeholder='Leírás'
            rows={4}
            value={description}
            onChange={(e) => setDescription(sanitizeUtfInput(e.target.value))}
            maxLength={MAX_DESCRIPTION_LENGTH}
          />
          <Input
            placeholder='Műfajok (vesszővel elválasztva)'
            value={genresInput}
            onChange={(e) => setGenresInput(sanitizeUtfInput(e.target.value))}
            maxLength={MAX_GENRES_LENGTH}
          />
          <div className='flex justify-end gap-2 mt-2'>
            <Button variant='ghost' onClick={() => onOpenChange(false)} disabled={submitting}>
              Mégse
            </Button>
            <Button onClick={handleSubmit} disabled={submitting || !name.trim()}>
              {isEdit ? 'Mentés' : 'Létrehozás'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
