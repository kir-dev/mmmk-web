'use client';

import { useEffect, useState } from 'react';

import BandRow from '@/components/band/bandRow';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { dummyBands } from '@/mocks/bands';

export default function Bands() {
  const data = dummyBands;
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    setFilteredData(data.filter((band) => band.name.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm]);
  return (
    <div className='w-full'>
      <div className='flex items-center justify-between flex-row p-4'>
        <h1 className='text-2xl font-semibold text-orange-500'>Zenekarok</h1>
        <Input
          placeholder='Keresés...'
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className='max-w-sm text-black target:ring-0'
        />
      </div>
      <Table>
        <TableBody>
          {filteredData.length ? (
            filteredData.map((band) => <BandRow band={band} key={band.id} />)
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
