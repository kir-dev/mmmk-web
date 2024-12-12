'use client';

import BandRow from '@/components/band/bandRow';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { dummyBands } from '@/mocks/bands';

export default function Bands() {
  const data = dummyBands;

  return (
    <div className='w-full'>
      <h1 className='text-2xl font-semibold p-4 text-orange-500'>Zenekarok</h1>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Keresés...'
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
      </div>
      <Table>
        <TableBody>
          {data.length ? (
            data.map((band) => <BandRow band={band} key={band.id} />)
          ) : (
            <TableRow>
              <TableCell colSpan={4} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
