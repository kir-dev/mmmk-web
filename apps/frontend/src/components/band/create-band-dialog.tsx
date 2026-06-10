'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import BandFormDialog from '@/components/band/band-form-dialog';
import { Button } from '@/components/ui/button';
import { Band } from '@/types/band';

type CreateBandDialogProps = {
  onCreated?: (band: Band) => void;
  knownGenres?: string[];
};

export default function CreateBandDialog({ onCreated, knownGenres }: CreateBandDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <BandFormDialog
      mode='create'
      open={open}
      onOpenChange={setOpen}
      onSuccess={(b) => onCreated?.(b)}
      knownGenres={knownGenres}
      trigger={
        <Button>
          <Plus />
        </Button>
      }
    />
  );
}
