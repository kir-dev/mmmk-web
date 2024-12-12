'use client';

import BandRow from '@/components/band/bandRow';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { dummyBands } from '@/mocks/bands';

export default function Bands() {
  const data = dummyBands;

  return (
    <div className='w-full'>
      {/* <div className='flex items-center py-4'>
        <Input
          placeholder='Filter emails...'
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
      </div> */}
      <div className='rounded-md border'>
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
    </div>
  );
}
