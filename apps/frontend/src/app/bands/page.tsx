'use client';

import { useEffect, useState } from 'react';

import BandRow from '@/components/band/band-row';
import CreateBandDialog from '@/components/band/create-band-dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import axiosApi from '@/lib/apiSetup';
import { Band } from '@/types/band';

export default function Bands() {
  const [bands, setBands] = useState<Band[]>([]);
  const [filteredData, setFilteredData] = useState<Band[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBands = () => {
    axiosApi.get('/bands').then((res) => {
      const fetched: Band[] = res.data;
      setBands(fetched);
      setFilteredData(fetched.filter((band) => band.name.toLowerCase().includes(searchTerm.toLowerCase())));
    });
  };

  useEffect(() => {
    fetchBands();
  }, []);

  useEffect(() => {
    setFilteredData(bands.filter((band) => band.name.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm, bands]);

  return (
    <div className='w-full main-content-scroll h-full'>
      <div className='flex items-center justify-between flex-row p-4 bg-background sticky top-0 z-10'>
        <h1 className='text-2xl font-semibold text-primary'>Zenekarok</h1>
        <div className='flex gap-4'>
          <CreateBandDialog onCreated={() => fetchBands()} />
          <Input
            placeholder='Keresés...'
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className='max-w-sm target:ring-0'
          />
        </div>
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
