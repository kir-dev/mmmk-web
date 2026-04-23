'use client';

import { useEffect, useMemo, useState } from 'react';

import BandRow from '@/components/band/band-row';
import CreateBandDialog from '@/components/band/create-band-dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useUser } from '@/hooks/useUser';
import axiosApi from '@/lib/apiSetup';
import { Band } from '@/types/band';

export default function Bands() {
  const [bands, setBands] = useState<Band[]>([]);
  const [filteredData, setFilteredData] = useState<Band[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useUser();

  const knownGenres = useMemo(() => {
    const genreSet = new Set<string>();
    bands.forEach((b) => b.genres?.forEach((g) => genreSet.add(g)));
    return Array.from(genreSet).sort();
  }, [bands]);

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
      <div className='flex items-center justify-between flex-col sm:flex-row gap-3 p-4 bg-background sticky top-0 z-10'>
        <h1 className='text-2xl font-semibold text-primary w-full sm:w-auto text-center sm:text-left'>Zenekarok</h1>
        <div className='flex gap-2 w-full sm:w-auto flex-col sm:flex-row'>
          {user && <CreateBandDialog onCreated={() => fetchBands()} knownGenres={knownGenres} />}
          <Input
            placeholder='Keresés...'
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className='w-full sm:max-w-sm target:ring-0'
          />
        </div>
      </div>
      <Table>
        {filteredData.length ? (
          filteredData.map((band) => <BandRow band={band} key={band.id} knownGenres={knownGenres} />)
        ) : (
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className='h-24 text-center'>
                Nincs találat.
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </div>
  );
}
