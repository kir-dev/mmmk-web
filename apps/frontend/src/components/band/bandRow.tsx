import { Play } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TableCell, TableRow } from '@/components/ui/table';
import { Band } from '@/types/band';

export default function BandRow({ band }: { band: Band }) {
  return (
    <Collapsible key={band.id} asChild>
      <>
        <TableRow>
          <TableCell colSpan={3}>
            <div>
              <strong className='text-xl'>{band.name}</strong>
              <h1>{band.genres}</h1>
            </div>
          </TableCell>
          <TableCell>{band.webPage}</TableCell>
          <TableCell>
            <a href={`mailto:${band.email}`}>{band.email}</a>
          </TableCell>
          <TableCell>{band.members?.length || 0} tag</TableCell>
          <TableCell>
            <CollapsibleTrigger asChild className='data-[state=open]:rotate-90 transition-all duration-300'>
              <Button size='icon'>
                <Play className='h-6 w-6' />
              </Button>
            </CollapsibleTrigger>
          </TableCell>
        </TableRow>
        <TableRow>
          <CollapsibleContent asChild>
            <TableCell colSpan={5}>
              <div className='flex flex-row justify-between px-4 gap-8'>
                <div>{band.description}</div>
                <div>
                  <strong>Tagok: </strong>
                  {band.members?.join(', ')}
                </div>
              </div>
            </TableCell>
          </CollapsibleContent>
        </TableRow>
      </>
    </Collapsible>
  );
}
