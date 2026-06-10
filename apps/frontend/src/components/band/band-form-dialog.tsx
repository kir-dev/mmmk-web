'use client';

import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TextArea } from '@/components/ui/textarea';
import { useUser } from '@/hooks/useUser';
import axiosApi from '@/lib/apiSetup';
import { showErrorToast } from '@/lib/errorToast';
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
  knownGenres?: string[];
};

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 200;
const MAX_WEBPAGE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_GENRES_LENGTH = 200;

export default function BandFormDialog({
  mode,
  band,
  open,
  onOpenChange,
  onSuccess,
  trigger,
  knownGenres,
}: BandFormDialogProps) {
  const { user } = useUser();
  const isEdit = useMemo(() => mode === 'edit', [mode]);

  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState(band?.name || '');
  const [email, setEmail] = useState(band?.email || '');
  const [webPage, setWebPage] = useState(band?.webPage || '');
  const [description, setDescription] = useState(band?.description || '');
  const [genresInput, setGenresInput] = useState((band?.genres || []).join(', '));
  const [showSuggestions, setShowSuggestions] = useState(false);
  const genresWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      // reset to initial when closing
      setName(band?.name || '');
      setEmail(band?.email || '');
      setWebPage(band?.webPage || '');
      setDescription(band?.description || '');
      setGenresInput((band?.genres || []).join(', '));
      setSubmitting(false);
      setShowSuggestions(false);
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

  // Derive suggestions: filter knownGenres by the current token (text after last comma)
  // and exclude genres already present in the input.
  const genreSuggestions = useMemo(() => {
    if (!knownGenres?.length || !showSuggestions) return [];

    const parts = genresInput.split(',');
    const currentToken = parts[parts.length - 1].trim().toLowerCase();
    const already = new Set(
      parts
        .slice(0, -1)
        .map((g) => g.trim().toLowerCase())
        .filter(Boolean)
    );

    return knownGenres.filter((g) => {
      const lower = g.toLowerCase();
      return !already.has(lower) && (currentToken === '' || lower.includes(currentToken));
    });
  }, [knownGenres, genresInput, showSuggestions]);

  const handleSelectSuggestion = (genre: string) => {
    const parts = genresInput.split(',');
    // Replace the last token (currently being typed) with the selected suggestion
    parts[parts.length - 1] = genre.trim();
    // Rejoin with comma-space and append a trailing comma-space
    const newVal = `${parts
      .map((p) => p.trim())
      .filter(Boolean)
      .join(', ')}, `;
    setGenresInput(newVal);
    // Keep suggestions open so they can rapidly click multiple genres
  };

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
        toast.success('Zenekar sikeresen szerkesztve!');
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
        toast.success('Zenekar sikeresen létrehozva!');
      }
    } catch (e: any) {
      if (e?.response?.status === 401) {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
        return;
      }
      showErrorToast(e);
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
          <div ref={genresWrapperRef} className='relative'>
            <Input
              placeholder='Műfajok (vesszővel elválasztva)'
              value={genresInput}
              onChange={(e) => setGenresInput(sanitizeUtfInput(e.target.value))}
              maxLength={MAX_GENRES_LENGTH}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                // Delay so a click on a suggestion registers first
                setTimeout(() => setShowSuggestions(false), 150);
              }}
            />
            {genreSuggestions.length > 0 && (
              <ul className='absolute z-50 mt-1 w-full rounded-md border border-input bg-background shadow-md max-h-48 overflow-y-auto'>
                {genreSuggestions.map((genre) => (
                  <li
                    key={genre}
                    onMouseDown={(e) => e.preventDefault()} // prevent blur before click
                    onClick={() => handleSelectSuggestion(genre)}
                    className='cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors'
                  >
                    {genre}
                  </li>
                ))}
              </ul>
            )}
          </div>
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
