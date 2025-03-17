'use client';

import MemberRow from '@components/member/memberRow';
import { Input } from '@components/ui/input';
import { Table, TableBody, TableCell, TableRow } from '@components/ui/table';
import { useEffect, useState } from 'react';

import { mockUsers } from '@/mocks/users';

export default function Members() {
  const data = mockUsers;
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilteredData(data.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm]);

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between flex-row p-4'>
        <h1 className='text-2xl font-semibold text-primary'>Felhasználók</h1>
        <Input
          placeholder='Keresés...'
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className='max-w-sm target:ring-0'
        />
      </div>
      <Table>
        <TableBody>
          {filteredData.length ? (
            filteredData.map((user) => <MemberRow user={user} key={user.id} />)
          ) : (
            <TableRow>
              <TableCell colSpan={4} className='h-24 text-center'>
                Nincs találat.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
